import { useMemo } from "react";
import { removeDuplicatesMedium } from "@algos/removeDuplicatesMedium/removeDuplicatesMedium";
import { StepPlayer } from "../components/StepPlayer";

// Frame trace of removeDuplicatesMedium from src/. k and i both start at 0.
// Each step compares nums[i] with nums[k-2] (the element 2 slots back in the
// OUTPUT array). When k < 2, nums[k-2] is undefined so the condition is always
// true — the first two elements are always kept. States are plain DATA; the real
// src/ function is used only to verify the answer.

type LogEvent =
  | { kind: "keep"; i: number; value: number; compareVal: number | undefined; compareIdx: number; k: number }
  | { kind: "skip"; i: number; value: number; compareVal: number; compareIdx: number; k: number }
  | { kind: "done"; k: number };

interface State {
  arr: number[]; // snapshot of the working array
  i: number;    // read pointer (-1 = after the loop)
  k: number;    // write pointer (next slot to write)
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: number } {
  const states: State[] = [];
  const arr = [...nums];
  let k = 0;

  for (let i = 0; i < arr.length; i++) {
    const compareVal = arr[k - 2]; // undefined when k < 2
    const compareIdx = k - 2;
    const currentVal = arr[i];
    if (currentVal !== compareVal) {
      arr[k] = currentVal;
      k++;
      states.push({
        arr: [...arr],
        i,
        k,
        log: { kind: "keep", i, value: currentVal, compareVal, compareIdx, k },
      });
    } else {
      states.push({
        arr: [...arr],
        i,
        k,
        log: { kind: "skip", i, value: currentVal, compareVal: compareVal as number, compareIdx, k },
      });
    }
  }

  states.push({ arr: [...arr], i: -1, k, log: { kind: "done", k } });
  return { states, answer: k };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "keep":
      if (event.compareVal === undefined) {
        return (
          <span className="ok">
            nums[{event.i}]={event.value}, k={event.k - 1}&lt;2 → always keep, write to slot{" "}
            {event.k - 1}, k→{event.k}.
          </span>
        );
      }
      return (
        <span className="ok">
          nums[{event.i}]={event.value} ≠ nums[k−2={event.compareIdx}]={event.compareVal} → write
          to slot {event.k - 1}, k→{event.k}.
        </span>
      );
    case "skip":
      return (
        <span className="cut">
          nums[{event.i}]={event.value} = nums[k−2={event.compareIdx}]={event.compareVal} → 3rd
          occurrence, skip, k stays {event.k}.
        </span>
      );
    case "done":
      return (
        <span className="done">
          Done. k = {event.k} (first k slots, each value at most twice).
        </span>
      );
  }
}

function RemoveDuplicatesMediumView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.arr.map((v, idx) => {
          const cls = ["cell"];
          if (idx < state.k) cls.push("in-window"); // kept region
          if (idx === state.k) cls.push("left-edge"); // write pointer
          if (idx === state.i) cls.push("right-edge"); // read pointer
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {v}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.arr.map((_, idx) => (
          <div className="ptr" key={idx}>
            {idx === state.k && <span className="l">k</span>}
            {idx === state.k && idx === state.i ? "/" : ""}
            {idx === state.i && <span className="r">i</span>}
          </div>
        ))}
      </div>

      <div className="stats">
        <div className="stat best">
          k<b>{state.k}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS = [1, 1, 1, 2, 2, 3];

export function RemoveDuplicatesMediumViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS), []);
  const expected = useMemo(() => removeDuplicatesMedium([...NUMS]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>removeDuplicatesMedium(nums=[{NUMS.join(",")}])</h1>
      <p className="legend">
        In-place dedup allowing at most 2 of each value. <b className="c-right">Green</b> is{" "}
        <b>i</b> (read pointer); <b className="c-left">yellow</b> is <b>k</b> (write pointer,
        next slot to fill). Each step compares <code>nums[i]</code> with{" "}
        <code>nums[k−2]</code> (2 slots back in the output). When they differ, copy to{" "}
        <code>nums[k]</code> and advance <b>k</b>; when equal a 3rd occurrence is detected and
        skipped. The first <b>k</b> cells (<b className="c-win">blue</b>) are the result.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <RemoveDuplicatesMediumView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: the visualization gives ${answer}, and the real removeDuplicatesMedium from src/ also gives ${expected}.`
          : `✗ Mismatch: the visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
