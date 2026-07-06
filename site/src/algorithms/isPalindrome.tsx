import { useMemo } from "react";
import { isPalindrome } from "@algos/isPalindrome/isPalindrome";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "match"; leftChar: string; rightChar: string }
  | { kind: "mismatch"; leftChar: string; rightChar: string };

interface State {
  chars: string[];
  left: number;
  right: number;
  log: LogEvent;
}

function buildStates(s: string): { states: State[]; answer: boolean } {
  const states: State[] = [];
  const line = s.replace(/[^A-Za-z0-9]/g, "").replace(/[A-Z]/g, (m) => m.toLowerCase());
  const chars = line.split("");

  if (line.length <= 1) {
    return { states, answer: true };
  }

  let left = 0;
  let right = line.length - 1;
  let is = true;
  while (left < right || !is) {
    const first = line[left];
    const last = line[right];
    if (first === last) {
      states.push({
        chars,
        left,
        right,
        log: { kind: "match", leftChar: first, rightChar: last },
      });
      left++;
      right--;
    } else {
      states.push({
        chars,
        left,
        right,
        log: { kind: "mismatch", leftChar: first, rightChar: last },
      });
      return { states, answer: false };
    }
  }
  return { states, answer: is };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "match") {
    return (
      <span className="ok">
        '{event.leftChar}' == '{event.rightChar}' → match, advance both pointers inward.
      </span>
    );
  }
  return (
    <span className="fail">
      '{event.leftChar}' != '{event.rightChar}' → mismatch, not a palindrome.
    </span>
  );
}

function IsPalindromeView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.chars.map((ch, idx) => {
          const isL = idx === state.left;
          const isR = idx === state.right;
          const cls = ["cell"];
          if (isL) cls.push("left-edge");
          if (isR) cls.push("right-edge");
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {ch}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.chars.map((_, idx) => (
          <div className="ptr" key={idx}>
            {idx === state.left && <span className="l">L</span>}
            {idx === state.right && <span className="r">R</span>}
          </div>
        ))}
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const INPUT = "racecar";

export function IsPalindromeViz() {
  const { states, answer } = useMemo(() => buildStates(INPUT), []);
  const expected = useMemo(() => isPalindrome(INPUT), []);
  const ok = answer === expected;

  return (
    <>
      <h1>isPalindrome("{INPUT}")</h1>
      <p className="legend">
        Strip non-alphanumeric chars and lowercase, then compare from both ends with two
        pointers <b className="c-left">L</b> (yellow) and <b className="c-right">R</b>{" "}
        (green). If all pairs match the string is a palindrome.
      </p>

      <StepPlayer states={states} render={(s) => <IsPalindromeView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
