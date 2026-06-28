import { useMemo } from "react";
import { hIndex } from "@algos/hIndex/hIndex";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "pass"; i: number; val: number; oldResult: number; newResult: number }
  | { kind: "fail-not-greater"; i: number; val: number; result: number }
  | { kind: "fail-zero"; i: number; val: number }
  | { kind: "done"; result: number };

interface State {
  sorted: number[];
  i: number;
  result: number;
  log: LogEvent;
}

function buildStates(citations: number[]): { states: State[]; answer: number } {
  const states: State[] = [];
  const sorted = [...citations].sort((a, b) => b - a);
  let result = 0;

  for (let i = 0; i < sorted.length; i += 1) {
    if (sorted[i] > 0 && sorted[i] > result) {
      const oldResult = result;
      result++;
      states.push({
        sorted,
        i,
        result,
        log: { kind: "pass", i, val: sorted[i], oldResult, newResult: result },
      });
    } else {
      const log =
        sorted[i] <= 0
          ? ({ kind: "fail-zero", i, val: sorted[i] } as const)
          : ({ kind: "fail-not-greater", i, val: sorted[i], result } as const);
      states.push({ sorted, i, result, log });
      break;
    }
  }

  states.push({
    sorted,
    i: sorted.length,
    result,
    log: { kind: "done", result },
  });

  return { states, answer: result };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "pass") {
    return (
      <span className="ok">
        sorted[{event.i}]={event.val} &gt; {event.oldResult} — h-index: {event.oldResult} →{" "}
        <code>{event.newResult}</code>.
      </span>
    );
  }
  if (event.kind === "fail-not-greater") {
    return (
      <span className="cut">
        sorted[{event.i}]={event.val} is not &gt; result={event.result} — break.
      </span>
    );
  }
  if (event.kind === "fail-zero") {
    return (
      <span className="cut">
        sorted[{event.i}]={event.val} is 0 — break.
      </span>
    );
  }
  return (
    <span className="done">
      Done. h-index = <code>{event.result}</code>.
    </span>
  );
}

function HIndexView({ state }: { state: State }) {
  const isDone = state.log.kind === "done";
  const isFail =
    state.log.kind === "fail-not-greater" || state.log.kind === "fail-zero";

  return (
    <>
      <div className="array">
        {state.sorted.map((val, idx) => {
          const isCurrent = !isDone && idx === state.i;
          const cls = ["cell"];
          if (isCurrent && !isFail) cls.push("left-edge");
          return (
            <div
              key={idx}
              className={cls.join(" ")}
              style={
                isCurrent && isFail
                  ? { borderColor: "#ef4444", boxShadow: "0 0 0 2px #ef4444 inset" }
                  : undefined
              }
            >
              <span className="idx">{idx}</span>
              {val}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.sorted.map((_, idx) => (
          <div className="ptr" key={idx}>
            {!isDone && idx === state.i && <span className="l">i</span>}
          </div>
        ))}
      </div>

      <div className="stats">
        <div className="stat best">
          h-index<b>{state.result}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const CITATIONS = [3, 0, 6, 1, 5];

export function HIndexViz() {
  const { states, answer } = useMemo(() => buildStates(CITATIONS), []);
  const expected = useMemo(() => hIndex([...CITATIONS]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>hIndex([{CITATIONS.join(", ")}])</h1>
      <p className="legend">
        Sort citations descending: [6, 5, 3, 1, 0]. Scan left to right — while{" "}
        <b className="c-left">sorted[i]</b> is positive and exceeds the current h-index,
        increment it. Stop at the first element that fails the check.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <HIndexView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
