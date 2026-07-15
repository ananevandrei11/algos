import { useMemo } from "react";
import { plusOne } from "@algos/plusOne/plusOne";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "increment"; i: number; curr: number; newDigit: number }
  | { kind: "carry"; i: number; curr: number }
  | { kind: "unshift" };

interface State {
  digits: number[];
  i: number | null;
  curr: number | null;
  log: LogEvent;
}

function buildStates(input: number[]): { states: State[]; answer: number[] } {
  const states: State[] = [];
  const digits = [...input];
  const length = digits.length - 1;

  for (let i = length; i >= 0; i -= 1) {
    const curr = digits[i];
    if (curr < 9) {
      digits[i] = curr + 1;
      states.push({
        digits: [...digits],
        i,
        curr,
        log: { kind: "increment", i, curr, newDigit: digits[i] },
      });
      return { states, answer: digits };
    } else if (curr === 9) {
      digits[i] = 0;
      states.push({
        digits: [...digits],
        i,
        curr,
        log: { kind: "carry", i, curr },
      });
    }
  }

  digits.unshift(1);
  states.push({ digits: [...digits], i: null, curr: null, log: { kind: "unshift" } });
  return { states, answer: digits };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "increment") {
    return (
      <span className="done">
        digit at index {event.i} is <code>{event.curr}</code> (&lt; 9): set it to{" "}
        <code>{event.newDigit}</code> and return immediately.
      </span>
    );
  }
  if (event.kind === "carry") {
    return (
      <span>
        digit at index {event.i} is <code>9</code>: set it to <code>0</code> and carry
        into the next digit to the left.
      </span>
    );
  }
  return (
    <span className="done">
      every digit was <code>9</code> and rolled over to <code>0</code>: unshift a leading{" "}
      <code>1</code>.
    </span>
  );
}

function PlusOneView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.digits.map((d, idx) => {
          const isActive = idx === state.i || (state.i === null && idx === 0 && state.log.kind === "unshift");
          const cls = ["cell"];
          if (isActive) cls.push("active");
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {d}
            </div>
          );
        })}
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const DIGITS = [9, 9, 9];

export function PlusOneViz() {
  const { states, answer } = useMemo(() => buildStates(DIGITS), []);
  const expected = useMemo(() => plusOne([...DIGITS]), []);
  const ok = JSON.stringify(answer) === JSON.stringify(expected);

  return (
    <>
      <h1>plusOne([{DIGITS.join(", ")}])</h1>
      <p className="legend">
        Walk the digits from the rightmost place. A digit below 9 is incremented and we
        return immediately; a <code>9</code> rolls over to <code>0</code> and carries left.
        If every digit was a <code>9</code>, prepend a new leading <code>1</code>.
      </p>

      <StepPlayer states={states} render={(s) => <PlusOneView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns [${answer.join(", ")}], src/ also returns [${expected.join(", ")}].`
          : `✗ Mismatch: visualization says [${answer.join(", ")}], but src/ returns [${expected.join(", ")}].`}
      </p>
    </>
  );
}
