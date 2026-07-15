import { useMemo } from "react";
import { strStr } from "@algos/strStr/strStr";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "skip"; i: number; ch: string }
  | { kind: "compare"; i: number; j: number; hChar: string | undefined; nChar: string; matched: boolean; isLast: boolean }
  | { kind: "found"; i: number }
  | { kind: "not-found" };

interface State {
  haystack: string;
  needle: string;
  i: number;
  j: number | null;
  log: LogEvent;
}

function buildStates(haystack: string, needle: string): { states: State[]; answer: number } {
  const states: State[] = [];

  if (needle.length === 0) {
    return { states: [{ haystack, needle, i: -1, j: null, log: { kind: "found", i: 0 } }], answer: 0 };
  }

  for (let i = 0; i < haystack.length; i += 1) {
    if (haystack[i] !== needle[0]) {
      states.push({ haystack, needle, i, j: null, log: { kind: "skip", i, ch: haystack[i] } });
      continue;
    }
    for (let j = 0; j < needle.length; j++) {
      const hChar = haystack[i + j];
      const isMatch = hChar === needle[j];
      const isLast = j === needle.length - 1;
      states.push({
        haystack,
        needle,
        i,
        j,
        log: { kind: "compare", i, j, hChar, nChar: needle[j], matched: isMatch, isLast },
      });
      if (!isMatch) break;
      if (isLast) {
        states.push({ haystack, needle, i, j, log: { kind: "found", i } });
        return { states, answer: i };
      }
    }
  }

  states.push({ haystack, needle, i: -1, j: null, log: { kind: "not-found" } });
  return { states, answer: -1 };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "skip") {
    return (
      <span className="hint">
        haystack[{event.i}] = '{event.ch}' doesn't match needle[0], skip to next i.
      </span>
    );
  }
  if (event.kind === "compare") {
    return (
      <span className={event.matched ? "ok" : "fail"}>
        compare haystack[{event.i}+{event.j}] = '{event.hChar ?? ""}' vs needle[{event.j}] ={" "}
        '{event.nChar}' → {event.matched ? "match" : "mismatch, break inner loop"}
        {event.matched && event.isLast ? " — full needle matched!" : ""}
      </span>
    );
  }
  if (event.kind === "found") {
    return (
      <span className="done">
        needle fully matched starting at index <code>{event.i}</code>. Return{" "}
        <code>{event.i}</code>.
      </span>
    );
  }
  return (
    <span className="fail">
      reached the end of haystack without a full match. Return <code>-1</code>.
    </span>
  );
}

function StrStrView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.haystack.split("").map((ch, idx) => {
          const cls = ["cell"];
          if (state.j !== null && idx >= state.i && idx <= state.i + state.j) {
            cls.push("active");
          } else if (idx === state.i) {
            cls.push("active");
          } else if (idx < state.i) {
            cls.push("visited");
          }
          return (
            <div className={cls.join(" ")} key={idx} style={{ width: 40, height: 40, fontSize: 16 }}>
              {ch}
            </div>
          );
        })}
      </div>

      <div className="stats" style={{ marginTop: 16 }}>
        <div className="stat target">
          i<b>{state.i}</b>
        </div>
        <div className="stat sum">
          j<b>{state.j ?? "—"}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const HAYSTACK = "mississippi";
const NEEDLE = "issi";

export function StrStrViz() {
  const { states, answer } = useMemo(() => buildStates(HAYSTACK, NEEDLE), []);
  const expected = useMemo(() => strStr(HAYSTACK, NEEDLE), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        strStr("{HAYSTACK}", "{NEEDLE}")
      </h1>
      <p className="legend">
        Brute-force search: for each starting index <code>i</code> in the haystack whose
        character matches the needle's first character, walk <code>j</code> through the
        needle comparing characters. A mismatch breaks the inner loop and moves to the
        next <code>i</code>; matching every needle character returns <code>i</code>.
      </p>

      <StepPlayer states={states} render={(s) => <StrStrView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
