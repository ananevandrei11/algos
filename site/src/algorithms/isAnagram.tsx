import { useMemo } from "react";
import { isAnagram } from "@algos/isAnagram/isAnagram";
import { StepPlayer } from "../components/StepPlayer";

// Traces the exact isAnagram implementation from src/:
// 1) Build sMap (char → count) by scanning s
// 2) Build tMap (char → count) by scanning t
// 3) Compare each key from sMap against tMap
// States are plain data; view renders them as two hash-table columns.

type LogEvent =
  | { kind: "build-s"; i: number; char: string; count: number; existed: boolean }
  | { kind: "build-t"; i: number; char: string; count: number; existed: boolean }
  | { kind: "compare"; key: string; sCount: number; tCount: number | undefined; match: boolean }
  | { kind: "done"; answer: boolean };

interface State {
  sMapEntries: [string, number][];
  tMapEntries: [string, number][];
  activeChar: string | null;
  phase: "build-s" | "build-t" | "compare" | "done";
  log: LogEvent;
}

function buildStates(s: string, t: string): { states: State[]; answer: boolean } {
  const states: State[] = [];

  if (s.length !== t.length) {
    return { states, answer: false };
  }
  if (s.length === 0 && t.length === 0) {
    return { states, answer: true };
  }

  const sMap = new Map<string, number>();
  for (let i = 0; i < s.length; i++) {
    const curr = s[i];
    const existed = sMap.has(curr);
    if (!existed) {
      sMap.set(curr, 1);
    } else {
      const getCurr = sMap.get(curr) || 0;
      sMap.set(curr, getCurr + 1);
    }
    const count = sMap.get(curr)!;
    states.push({
      sMapEntries: Array.from(sMap.entries()),
      tMapEntries: [],
      activeChar: curr,
      phase: "build-s",
      log: { kind: "build-s", i, char: curr, count, existed },
    });
  }

  const tMap = new Map<string, number>();
  for (let i = 0; i < t.length; i++) {
    const curr = t[i];
    const existed = tMap.has(curr);
    if (!existed) {
      tMap.set(curr, 1);
    } else {
      const getCurr = tMap.get(curr) || 0;
      tMap.set(curr, getCurr + 1);
    }
    const count = tMap.get(curr)!;
    states.push({
      sMapEntries: Array.from(sMap.entries()),
      tMapEntries: Array.from(tMap.entries()),
      activeChar: curr,
      phase: "build-t",
      log: { kind: "build-t", i, char: curr, count, existed },
    });
  }

  const sMapKeys = [...sMap.keys()];
  let answer = true;
  for (let i = 0; i < sMapKeys.length; i++) {
    const key = sMapKeys[i];
    const sCount = sMap.get(key);
    const tCount = tMap.get(key);
    const match = !!(tCount && sCount && tCount === sCount);
    states.push({
      sMapEntries: Array.from(sMap.entries()),
      tMapEntries: Array.from(tMap.entries()),
      activeChar: key,
      phase: "compare",
      log: { kind: "compare", key, sCount: sCount!, tCount, match },
    });
    if (!tCount || !sCount || tCount !== sCount) {
      answer = false;
      break;
    }
  }

  states.push({
    sMapEntries: Array.from(sMap.entries()),
    tMapEntries: Array.from(tMap.entries()),
    activeChar: null,
    phase: "done",
    log: { kind: "done", answer },
  });

  return { states, answer };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "build-s":
      return (
        <span>
          s[{event.i}]=<code>'{event.char}'</code>{" "}
          {event.existed
            ? `already in sMap → count=${event.count}`
            : `new → sMap.set('${event.char}', 1)`}
        </span>
      );
    case "build-t":
      return (
        <span>
          t[{event.i}]=<code>'{event.char}'</code>{" "}
          {event.existed
            ? `already in tMap → count=${event.count}`
            : `new → tMap.set('${event.char}', 1)`}
        </span>
      );
    case "compare":
      return (
        <span>
          key=<code>'{event.key}'</code>: sMap={event.sCount}, tMap=
          {event.tCount ?? "missing"}.{" "}
          {event.match ? (
            <span className="ok">match ✓</span>
          ) : (
            <span className="cut">mismatch → return false</span>
          )}
        </span>
      );
    case "done":
      return (
        <span className={event.answer ? "ok" : "cut"}>
          Done. Answer = {String(event.answer)}.
        </span>
      );
  }
}

function MapTable({
  label,
  entries,
  activeChar,
  color,
}: {
  label: string;
  entries: [string, number][];
  activeChar: string | null;
  color: string;
}) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {entries.map(([k, v]) => {
          const isActive = k === activeChar;
          return (
            <div
              key={k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 6,
                border: `1px solid ${isActive ? color : "#2a2e3a"}`,
                background: isActive ? "#1a1a2e" : "#161922",
                fontSize: 13,
              }}
            >
              <span style={{ color, fontFamily: "ui-monospace, monospace" }}>'{k}'</span>
              <span style={{ color: "#5a5f6a" }}>→</span>
              <span style={{ color: "#3b82f6", fontFamily: "ui-monospace, monospace" }}>{v}</span>
            </div>
          );
        })}
        {entries.length === 0 && (
          <span style={{ color: "#3a3f4a", fontSize: 13 }}>empty</span>
        )}
      </div>
    </div>
  );
}

function IsAnagramView({ s, t, state }: { s: string; t: string; state: State }) {
  return (
    <>
      <div className="array">
        {[...s].map((ch, i) => (
          <div
            className={["cell", state.phase === "build-s" && state.activeChar === ch ? "left-edge" : ""].join(" ")}
            key={`s-${i}`}
            style={{ opacity: state.phase === "build-s" ? (i <= state.sMapEntries.length - 1 ? 1 : 0.3) : 1 }}
          >
            <span className="idx">{i}</span>
            {ch}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#5a5f6a", marginBottom: 4 }}>s = "{s}"</div>

      <div className="array" style={{ marginTop: 8 }}>
        {[...t].map((ch, i) => (
          <div
            className={["cell", state.phase === "build-t" && state.activeChar === ch ? "right-edge" : ""].join(" ")}
            key={`t-${i}`}
            style={{ opacity: state.phase === "build-t" ? (i <= state.tMapEntries.length - 1 ? 1 : 0.3) : 1 }}
          >
            <span className="idx">{i}</span>
            {ch}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#5a5f6a", marginBottom: 16 }}>t = "{t}"</div>

      <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
        <MapTable
          label="sMap (char → count)"
          entries={state.sMapEntries}
          activeChar={state.phase === "build-s" || state.phase === "compare" ? state.activeChar : null}
          color="#f59e0b"
        />
        <MapTable
          label="tMap (char → count)"
          entries={state.tMapEntries}
          activeChar={state.phase === "build-t" || state.phase === "compare" ? state.activeChar : null}
          color="#10b981"
        />
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const S = "anagram";
const T = "nagaram";

export function IsAnagramViz() {
  const { states, answer } = useMemo(() => buildStates(S, T), []);
  const expected = useMemo(() => isAnagram(S, T), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        isAnagram("{S}", "{T}")
      </h1>
      <p className="legend">
        Build <b className="c-left">sMap</b> (char→count) over <b>s</b>, then{" "}
        <b className="c-right">tMap</b> over <b>t</b>. Compare each key: if all
        counts match, the strings are anagrams.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <IsAnagramView s={S} t={T} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ isAnagram also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
