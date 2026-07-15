import { useMemo } from "react";
import { isHappy } from "@algos/isHappy/isHappy";
import { StepPlayer } from "../components/StepPlayer";

interface DigitStep {
  digit: number;
  sumSoFar: number;
  nAfter: number;
}

type LogEvent =
  | { kind: "iterate"; n: number; sum: number }
  | { kind: "done-happy"; n: number }
  | { kind: "done-cycle"; n: number };

interface State {
  n: number;
  seenBefore: number[];
  digitSteps: DigitStep[];
  sum: number;
  nextN: number | null;
  log: LogEvent;
}

function buildStates(n0: number): { states: State[]; answer: boolean } {
  const states: State[] = [];
  const seen = new Set<number>();
  let n = n0;

  while (n !== 1 && !seen.has(n)) {
    const seenBefore = Array.from(seen);
    seen.add(n);

    let sum = 0;
    const digitSteps: DigitStep[] = [];
    let cur = n;
    while (cur > 0) {
      const digit = cur % 10;
      sum += digit * digit;
      cur = Math.floor(cur / 10);
      digitSteps.push({ digit, sumSoFar: sum, nAfter: cur });
    }

    states.push({
      n,
      seenBefore,
      digitSteps,
      sum,
      nextN: sum,
      log: { kind: "iterate", n, sum },
    });

    n = sum;
  }

  const answer = n === 1;
  states.push({
    n,
    seenBefore: Array.from(seen),
    digitSteps: [],
    sum: n,
    nextN: null,
    log: answer ? { kind: "done-happy", n } : { kind: "done-cycle", n },
  });

  return { states, answer };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "iterate") {
    return (
      <span>
        <code>{event.n}</code> is not <code>1</code> and hasn't been seen yet: sum of
        squared digits = <code>{event.sum}</code>. Continue with{" "}
        <code>n = {event.sum}</code>.
      </span>
    );
  }
  if (event.kind === "done-happy") {
    return (
      <span className="done">
        <code>n === 1</code> → loop stops. <code>{event.n}</code> is a happy number.
      </span>
    );
  }
  return (
    <span className="fail">
      <code>n = {event.n}</code> has already been seen → cycle detected, loop stops. Not
      happy.
    </span>
  );
}

function IsHappyView({ state }: { state: State }) {
  return (
    <>
      <div className="stats">
        <div className="stat target">
          n<b>{state.n}</b>
        </div>
        <div className="stat sum">
          sum of squares<b>{state.sum}</b>
        </div>
        <div className="stat best">
          next n<b>{state.nextN ?? "—"}</b>
        </div>
      </div>

      <div
        style={{
          background: "#161922",
          border: "1px solid #2a2e3a",
          borderRadius: 8,
          padding: "16px 18px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <div>
          <span className="hint">seen so far:</span>{" "}
          {state.seenBefore.length === 0 ? (
            <code>{"{}"}</code>
          ) : (
            state.seenBefore.map((v) => <code key={v} style={{ marginRight: 6 }}>{v}</code>)
          )}
        </div>
        {state.digitSteps.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <span className="hint">digit steps:</span>{" "}
            {state.digitSteps.map((step, idx) => (
              <code key={idx} style={{ marginRight: 8 }}>
                {step.digit}² → sum={step.sumSoFar}, n={step.nAfter}
              </code>
            ))}
          </div>
        )}
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const N = 19;

export function IsHappyViz() {
  const { states, answer } = useMemo(() => buildStates(N), []);
  const expected = useMemo(() => isHappy(N), []);
  const ok = answer === expected;

  return (
    <>
      <h1>isHappy({N})</h1>
      <p className="legend">
        While <code>n</code> is not <code>1</code> and hasn't been seen before, replace{" "}
        <code>n</code> with the sum of the squares of its digits (computed digit by digit
        via the inner loop, exactly as in <code>src/</code>). Stop when <code>n === 1</code>{" "}
        (happy) or when a value repeats (cycle, not happy).
      </p>

      <StepPlayer states={states} render={(s) => <IsHappyView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
