import { useMemo } from "react";
import { groupAnagrams } from "@algos/groupAnagrams/groupAnagrams";
import { StepPlayer } from "../components/StepPlayer";

// Traces the exact groupAnagrams implementation from src/:
// For each string, sort its chars to derive a key, then push into the groups Map.
// States are plain data; view shows groups map as key→[words] rows.

type LogEvent =
  | { kind: "process"; str: string; key: string; existed: boolean }
  | { kind: "done" };

interface State {
  currentStr: string | null;
  currentKey: string | null;
  groupEntries: [string, string[]][];
  log: LogEvent;
}

function buildStates(strs: string[]): { states: State[]; answer: string[][] } {
  const states: State[] = [];

  if (strs.length === 1) {
    states.push({
      currentStr: strs[0],
      currentKey: null,
      groupEntries: [[strs[0], [strs[0]]]],
      log: { kind: "process", str: strs[0], key: strs[0], existed: false },
    });
    states.push({
      currentStr: null,
      currentKey: null,
      groupEntries: [[strs[0], [strs[0]]]],
      log: { kind: "done" },
    });
    return { states, answer: [[strs[0]]] };
  }

  const groups = new Map<string, string[]>();
  for (const str of strs) {
    const key = [...str].sort().join("");
    const existed = groups.has(key);
    const group = groups.get(key);
    if (group) {
      group.push(str);
    } else {
      groups.set(key, [str]);
    }
    states.push({
      currentStr: str,
      currentKey: key,
      groupEntries: Array.from(groups.entries()),
      log: { kind: "process", str, key, existed },
    });
  }

  states.push({
    currentStr: null,
    currentKey: null,
    groupEntries: Array.from(groups.entries()),
    log: { kind: "done" },
  });

  return { states, answer: [...groups.values()] };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "process":
      return (
        <span>
          str=<code>"{event.str}"</code> → key=<code>"{event.key}"</code>.{" "}
          {event.existed ? (
            <span className="ok">key exists → push to group</span>
          ) : (
            <span>new key → create group</span>
          )}
        </span>
      );
    case "done":
      return <span className="done">Done. All strings grouped.</span>;
  }
}

function GroupAnagramsView({
  strs,
  state,
}: {
  strs: string[];
  state: State;
}) {
  return (
    <>
      <div className="array">
        {strs.map((s, i) => {
          const isCurrent = s === state.currentStr;
          return (
            <div
              className={["cell", isCurrent ? "left-edge" : ""].join(" ")}
              key={i}
              style={{ fontSize: 13, minWidth: 40 }}
            >
              <span className="idx">{i}</span>
              {s}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 8 }}>
          groups (sorted-key → [words]):
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {state.groupEntries.map(([key, words]) => {
            const isActive = key === state.currentKey;
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: `1px solid ${isActive ? "#f59e0b" : "#2a2e3a"}`,
                  background: isActive ? "#1e1a0f" : "#161922",
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    color: "#f59e0b",
                    fontFamily: "ui-monospace, monospace",
                    minWidth: 60,
                  }}
                >
                  "{key}"
                </span>
                <span style={{ color: "#5a5f6a" }}>→</span>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {words.map((w, j) => (
                    <span
                      key={j}
                      style={{
                        color: w === state.currentStr && isActive ? "#10b981" : "#3b82f6",
                        fontFamily: "ui-monospace, monospace",
                      }}
                    >
                      "{w}"
                      {j < words.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
          {state.groupEntries.length === 0 && (
            <span style={{ color: "#3a3f4a", fontSize: 13 }}>empty</span>
          )}
        </div>
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const STRS = ["eat", "tea", "tan", "ate", "nat", "bat"];

export function GroupAnagramsViz() {
  const { states, answer } = useMemo(() => buildStates(STRS), []);
  const expected = useMemo(() => groupAnagrams(STRS), []);

  // Compare group sets (order-insensitive)
  const normalize = (gs: string[][]): string =>
    gs
      .map((g) => [...g].sort().join(","))
      .sort()
      .join("|");
  const ok = normalize(answer) === normalize(expected);

  return (
    <>
      <h1>groupAnagrams(["{STRS.join('", "')}"])</h1>
      <p className="legend">
        For each string, sort its characters to get a <b className="c-left">canonical key</b>.
        Strings with the same key are anagrams of each other — push them into the same group.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <GroupAnagramsView strs={STRS} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization groups match src/ groupAnagrams output.`
          : `✗ Mismatch: visualization groups differ from src/ output.`}
      </p>
    </>
  );
}
