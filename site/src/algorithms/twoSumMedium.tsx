import { useMemo } from "react";
import { twoSumMedium } from "@algos/twoSumMedium/twoSumMedium";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "check"; i: number; j: number; curr: number; currNext: number; sum: number; target: number }
  | { kind: "found"; i: number; j: number; curr: number; currNext: number; target: number; result: number[] };

interface State {
  numbers: readonly number[];
  i: number;
  j: number;
  log: LogEvent;
}

function buildStates(
  numbers: number[],
  target: number
): { states: State[]; answer: number[] } {
  const states: State[] = [];

  for (let i = 0; i < numbers.length; i++) {
    const curr = numbers[i];
    for (let j = i + 1; j < numbers.length; j++) {
      const currNext = numbers[j];
      const sum = curr + currNext;
      if (sum === target) {
        states.push({
          numbers,
          i,
          j,
          log: { kind: "found", i, j, curr, currNext, target, result: [i + 1, j + 1] },
        });
        return { states, answer: [i + 1, j + 1] };
      }
      states.push({
        numbers,
        i,
        j,
        log: { kind: "check", i, j, curr, currNext, sum, target },
      });
    }
  }

  return { states, answer: [] };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "check":
      return (
        <span>
          numbers[{event.i}]={event.curr} + numbers[{event.j}]={event.currNext} ={" "}
          {event.sum} ≠ {event.target} → continue.
        </span>
      );
    case "found":
      return (
        <span className="ok">
          numbers[{event.i}]={event.curr} + numbers[{event.j}]={event.currNext} ={" "}
          {event.target} → return [{event.result[0]}, {event.result[1]}] (1-indexed).
        </span>
      );
  }
}

function TwoSumMediumView({ state }: { state: State }) {
  const isFound = state.log.kind === "found";
  return (
    <>
      <div className="array">
        {state.numbers.map((v, idx) => {
          const cls = ["cell"];
          if (idx === state.i) cls.push("left-edge");
          if (idx === state.j) cls.push("right-edge");
          if (isFound && (idx === state.i || idx === state.j)) cls.push("in-window");
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {v}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.numbers.map((_, idx) => (
          <div className="ptr" key={idx}>
            {idx === state.i && <span className="l">i</span>}
            {idx === state.j && <span className="r">j</span>}
          </div>
        ))}
      </div>

      <div className="stats">
        <div className="stat">
          i<b>{state.i}</b>
        </div>
        <div className="stat">
          j<b>{state.j}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMBERS = [1, 5, 6, 8, 15];
const TARGET = 11;

export function TwoSumMediumViz() {
  const { states, answer } = useMemo(() => buildStates(NUMBERS, TARGET), []);
  const expected = useMemo(() => twoSumMedium([...NUMBERS], TARGET), []);
  const ok = JSON.stringify(answer) === JSON.stringify(expected);

  return (
    <>
      <h1>
        twoSumMedium(numbers=[{NUMBERS.join(",")}], target={TARGET})
      </h1>
      <p className="legend">
        Naive O(n²) nested-loop two-sum. <b className="c-left">Yellow</b> is{" "}
        <b>i</b> (outer loop); <b className="c-right">green</b> is <b>j</b>{" "}
        (inner loop). Each iteration sums <code>numbers[i] + numbers[j]</code>{" "}
        and checks against <b>target</b>. On match, returns 1-indexed{" "}
        <code>[i+1, j+1]</code>.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <TwoSumMediumView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: the visualization gives [${answer}], and the real twoSumMedium from src/ also gives [${expected}].`
          : `✗ Mismatch: the visualization says [${answer}], but src/ returns [${expected}].`}
      </p>
    </>
  );
}
