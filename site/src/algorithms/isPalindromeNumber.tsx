import { useMemo } from "react";
import { isPalindromeNumber } from "@algos/isPalindromeNumber/isPalindromeNumber";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "init"; left: number; right: number }
  | { kind: "match"; left: number; right: number; leftChar: string; rightChar: string }
  | { kind: "mismatch"; left: number; right: number; leftChar: string; rightChar: string }
  | { kind: "done" };

interface State {
  chars: string[];
  left: number;
  right: number;
  log: LogEvent;
}

function buildStates(x: number): { states: State[]; answer: boolean } {
  const states: State[] = [];
  const arrNums = x.toString().split("");
  let left = 0;
  let right = arrNums.length - 1;

  states.push({ chars: [...arrNums], left, right, log: { kind: "init", left, right } });

  while (left < right) {
    if (arrNums[left] !== arrNums[right]) {
      states.push({
        chars: [...arrNums],
        left,
        right,
        log: { kind: "mismatch", left, right, leftChar: arrNums[left], rightChar: arrNums[right] },
      });
      return { states, answer: false };
    }
    states.push({
      chars: [...arrNums],
      left,
      right,
      log: { kind: "match", left, right, leftChar: arrNums[left], rightChar: arrNums[right] },
    });
    left++;
    right--;
  }

  states.push({ chars: [...arrNums], left, right, log: { kind: "done" } });
  return { states, answer: true };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "init") {
    return (
      <span>
        Convert the number to a digit array. Compare from both ends while{" "}
        <code>left &lt; right</code>.
      </span>
    );
  }
  if (event.kind === "match") {
    return (
      <span className="ok">
        '{event.leftChar}' == '{event.rightChar}' → match, advance both pointers inward.
      </span>
    );
  }
  if (event.kind === "mismatch") {
    return (
      <span className="fail">
        '{event.leftChar}' != '{event.rightChar}' → mismatch, not a palindrome.
      </span>
    );
  }
  return (
    <span className="done">
      <code>left &lt; right</code> is false → every pair matched, palindrome confirmed.
    </span>
  );
}

function IsPalindromeNumberView({ state }: { state: State }) {
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

const X = 1221;

export function IsPalindromeNumberViz() {
  const { states, answer } = useMemo(() => buildStates(X), []);
  const expected = useMemo(() => isPalindromeNumber(X), []);
  const ok = answer === expected;

  return (
    <>
      <h1>isPalindromeNumber({X})</h1>
      <p className="legend">
        Turn the number into its digit characters, then compare from both ends with two
        pointers <b className="c-left">L</b> (yellow) and <b className="c-right">R</b>{" "}
        (green). If every pair matches before the pointers cross, it's a palindrome.
      </p>

      <StepPlayer states={states} render={(s) => <IsPalindromeNumberView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
