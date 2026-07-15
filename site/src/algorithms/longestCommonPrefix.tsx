import { useMemo } from "react";
import { longestCommonPrefix } from "@algos/longestCommonPrefix/longestCommonPrefix";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "compare"; i: number; j: number; letter: string; other: string; match: boolean }
  | { kind: "accept"; i: number; letter: string; result: string }
  | { kind: "stop"; i: number; letter: string }
  | { kind: "done"; result: string };

interface State {
  strs: string[];
  i: number;
  j: number | null;
  result: string;
  log: LogEvent;
}

function buildStates(strs: string[]): { states: State[]; answer: string } {
  const states: State[] = [];
  let result = "";
  const firstWord = strs[0];

  for (let i = 0; i < firstWord.length; i += 1) {
    const letter = firstWord[i];
    let matched = true;
    for (let j = 1; j < strs.length; j += 1) {
      const isMatch = letter === strs[j][i];
      states.push({
        strs,
        i,
        j,
        result,
        log: { kind: "compare", i, j, letter, other: strs[j][i], match: isMatch },
      });
      if (!isMatch) {
        matched = false;
        break;
      }
    }
    if (!matched) {
      states.push({ strs, i, j: null, result, log: { kind: "stop", i, letter } });
      break;
    }
    result += letter;
    states.push({ strs, i, j: null, result, log: { kind: "accept", i, letter, result } });
  }

  states.push({ strs, i: -1, j: null, result, log: { kind: "done", result } });
  return { states, answer: result };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "compare") {
    return (
      <span className={event.match ? "ok" : "fail"}>
        strs[{event.j}][{event.i}] = '{event.other}' vs '{event.letter}' →{" "}
        {event.match ? "match" : "mismatch"}
      </span>
    );
  }
  if (event.kind === "accept") {
    return (
      <span className="ok">
        column {event.i} ('{event.letter}') matched in every string → result ={" "}
        <code>"{event.result}"</code>
      </span>
    );
  }
  if (event.kind === "stop") {
    return (
      <span className="fail">
        column {event.i} ('{event.letter}') didn't match everywhere → stop scanning.
      </span>
    );
  }
  return (
    <span className="done">
      final common prefix: <code>"{event.result}"</code>
    </span>
  );
}

function LongestCommonPrefixView({ state }: { state: State }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {state.strs.map((word, si) => (
          <div className="array" key={si} style={{ margin: 0 }}>
            {word.split("").map((ch, ci) => {
              const cls = ["cell"];
              if (ci === state.i && (si === state.j || (si === 0 && state.j === null))) {
                cls.push("active");
              } else if (ci < state.i) {
                cls.push("visited");
              }
              return (
                <div className={cls.join(" ")} key={ci} style={{ width: 40, height: 40, fontSize: 16 }}>
                  {ch}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#161922",
          border: "1px solid #2a2e3a",
          borderRadius: 8,
          padding: "16px 18px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 18,
          marginTop: 16,
        }}
      >
        result: "{state.result}"
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const STRS = ["flower", "flow", "flight"];

export function LongestCommonPrefixViz() {
  const { states, answer } = useMemo(() => buildStates(STRS), []);
  const expected = useMemo(() => longestCommonPrefix(STRS), []);
  const ok = answer === expected;

  return (
    <>
      <h1>longestCommonPrefix([{STRS.map((s) => `"${s}"`).join(", ")}])</h1>
      <p className="legend">
        Walk the first string's characters one column at a time. For each column, check
        that every other string has the same character in that position. Stop at the
        first mismatch; the accumulated result is the longest common prefix.
      </p>

      <StepPlayer states={states} render={(s) => <LongestCommonPrefixView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns "${answer}", src/ also returns "${expected}".`
          : `✗ Mismatch: visualization says "${answer}", but src/ returns "${expected}".`}
      </p>
    </>
  );
}
