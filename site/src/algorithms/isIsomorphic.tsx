import { useMemo } from "react";
import { isIsomorphic } from "@algos/isIsomorphic/isIsomorphic";
import { StepPlayer } from "../components/StepPlayer";

// Traces the exact isIsomorphic implementation from src/:
// getMap(word) builds char → [indices] for each word.
// Then checks: sizes equal, and index arrays align position-by-position.
// States are plain data; view shows the two maps as hash-table rows.

type LogEvent =
  | { kind: "build-s"; i: number; char: string; indices: number[]; existed: boolean }
  | { kind: "build-t"; i: number; char: string; indices: number[]; existed: boolean }
  | { kind: "size-check"; sSize: number; tSize: number; pass: boolean }
  | { kind: "compare-pair"; si: number; sIndices: number[]; tIndices: number[]; j: number; match: boolean }
  | { kind: "done"; answer: boolean };

interface State {
  sMapEntries: [string, number[]][];
  tMapEntries: [string, number[]][];
  phase: "build-s" | "build-t" | "compare" | "done";
  activeIdx: number | null; // outer index i in compare loop
  log: LogEvent;
}

function buildStates(s: string, t: string): { states: State[]; answer: boolean } {
  const states: State[] = [];

  // getMap inlined for tracing
  const sMap = new Map<string, number[]>();
  for (let i = 0; i < s.length; i += 1) {
    const curr = s[i];
    const existed = sMap.has(curr);
    if (!existed) {
      sMap.set(curr, [i]);
    } else {
      const getCurr = sMap.get(curr) || [];
      getCurr.push(i);
      sMap.set(curr, getCurr);
    }
    states.push({
      sMapEntries: Array.from(sMap.entries()),
      tMapEntries: [],
      phase: "build-s",
      activeIdx: null,
      log: { kind: "build-s", i, char: curr, indices: [...sMap.get(curr)!], existed },
    });
  }

  const tMap = new Map<string, number[]>();
  for (let i = 0; i < t.length; i += 1) {
    const curr = t[i];
    const existed = tMap.has(curr);
    if (!existed) {
      tMap.set(curr, [i]);
    } else {
      const getCurr = tMap.get(curr) || [];
      getCurr.push(i);
      tMap.set(curr, getCurr);
    }
    states.push({
      sMapEntries: Array.from(sMap.entries()),
      tMapEntries: Array.from(tMap.entries()),
      phase: "build-t",
      activeIdx: null,
      log: { kind: "build-t", i, char: curr, indices: [...tMap.get(curr)!], existed },
    });
  }

  const sizePass = sMap.size === tMap.size;
  states.push({
    sMapEntries: Array.from(sMap.entries()),
    tMapEntries: Array.from(tMap.entries()),
    phase: "compare",
    activeIdx: null,
    log: { kind: "size-check", sSize: sMap.size, tSize: tMap.size, pass: sizePass },
  });

  if (!sizePass) {
    states.push({
      sMapEntries: Array.from(sMap.entries()),
      tMapEntries: Array.from(tMap.entries()),
      phase: "done",
      activeIdx: null,
      log: { kind: "done", answer: false },
    });
    return { states, answer: false };
  }

  const sMapIndexes = [...sMap.values()];
  const tMapIndexes = [...tMap.values()];
  let answer = true;

  outer: for (let i = 0; i < sMapIndexes.length; i += 1) {
    const currS = sMapIndexes[i];
    const currT = tMapIndexes[i];
    for (let j = 0; j < currS.length; j += 1) {
      const match = currS[j] === currT[j];
      states.push({
        sMapEntries: Array.from(sMap.entries()),
        tMapEntries: Array.from(tMap.entries()),
        phase: "compare",
        activeIdx: i,
        log: { kind: "compare-pair", si: i, sIndices: [...currS], tIndices: [...currT], j, match },
      });
      if (!match) {
        answer = false;
        break outer;
      }
    }
  }

  states.push({
    sMapEntries: Array.from(sMap.entries()),
    tMapEntries: Array.from(tMap.entries()),
    phase: "done",
    activeIdx: null,
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
          {event.existed ? `→ append ${event.i}` : "→ new entry"}{" "}
          indices=[{event.indices.join(",")}]
        </span>
      );
    case "build-t":
      return (
        <span>
          t[{event.i}]=<code>'{event.char}'</code>{" "}
          {event.existed ? `→ append ${event.i}` : "→ new entry"}{" "}
          indices=[{event.indices.join(",")}]
        </span>
      );
    case "size-check":
      return (
        <span>
          sMap.size={event.sSize}, tMap.size={event.tSize}.{" "}
          {event.pass ? (
            <span className="ok">equal → continue</span>
          ) : (
            <span className="cut">different → return false</span>
          )}
        </span>
      );
    case "compare-pair":
      return (
        <span>
          pair[{event.si}]: sIndices=[{event.sIndices.join(",")}] vs tIndices=[
          {event.tIndices.join(",")}]. j={event.j}:{" "}
          {event.match ? (
            <span className="ok">{event.sIndices[event.j]} === {event.tIndices[event.j]} ✓</span>
          ) : (
            <span className="cut">
              {event.sIndices[event.j]} ≠ {event.tIndices[event.j]} → return false
            </span>
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

function IndicesMap({
  label,
  entries,
  activeIdx,
  color,
}: {
  label: string;
  entries: [string, number[]][];
  activeIdx: number | null;
  color: string;
}) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {entries.map(([k, indices], idx) => {
          const isActive = activeIdx === idx;
          return (
            <div
              key={k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 6,
                border: `1px solid ${isActive ? color : "#2a2e3a"}`,
                background: isActive ? "#1a1a2e" : "#161922",
                fontSize: 13,
              }}
            >
              <span style={{ color, fontFamily: "ui-monospace, monospace" }}>'{k}'</span>
              <span style={{ color: "#5a5f6a" }}>→</span>
              <span style={{ color: "#3b82f6", fontFamily: "ui-monospace, monospace" }}>
                [{indices.join(",")}]
              </span>
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

function IsIsomorphicView({ s, t, state }: { s: string; t: string; state: State }) {
  return (
    <>
      <div className="array">
        {[...s].map((ch, i) => (
          <div className="cell" key={i}>
            <span className="idx">{i}</span>
            {ch}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#5a5f6a", marginBottom: 4 }}>s = "{s}"</div>

      <div className="array" style={{ marginTop: 8 }}>
        {[...t].map((ch, i) => (
          <div className="cell" key={i}>
            <span className="idx">{i}</span>
            {ch}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "#5a5f6a", marginBottom: 16 }}>t = "{t}"</div>

      <div style={{ display: "flex", gap: 24 }}>
        <IndicesMap
          label="sMap (char → [indices])"
          entries={state.sMapEntries}
          activeIdx={state.phase === "compare" ? state.activeIdx : null}
          color="#f59e0b"
        />
        <IndicesMap
          label="tMap (char → [indices])"
          entries={state.tMapEntries}
          activeIdx={state.phase === "compare" ? state.activeIdx : null}
          color="#10b981"
        />
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const S = "egg";
const T = "add";

export function IsIsomorphicViz() {
  const { states, answer } = useMemo(() => buildStates(S, T), []);
  const expected = useMemo(() => isIsomorphic(S, T), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        isIsomorphic("{S}", "{T}")
      </h1>
      <p className="legend">
        Build <b className="c-left">sMap</b> and <b className="c-right">tMap</b> mapping
        each character to the list of its indices. Two strings are isomorphic when their
        maps have the same size and every pair of index arrays is identical position-by-position.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <IsIsomorphicView s={S} t={T} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ isIsomorphic also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
