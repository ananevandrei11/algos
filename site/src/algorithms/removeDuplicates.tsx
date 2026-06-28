import { useMemo } from "react";
import { removeDuplicates } from "@algos/removeDuplicates/removeDuplicates";
import { StepPlayer } from "../components/StepPlayer";

// Frame trace of the in-place removeDuplicates from src/. The array is sorted, so
// duplicates are adjacent: `i` reads from index 1, comparing nums[i] against the
// PREVIOUS element nums[i-1] on the working (mutated) array — exactly as src does.
// `k` is the next write slot; it starts at 1 because nums[0] is always kept. When
// nums[i] !== nums[i-1], the value is copied to nums[k] and k advances. States are
// plain DATA; the real src/ function is used only to verify the answer.

type LogEvent =
  | { kind: "start" }
  | { kind: "keep"; i: number; value: number; prev: number; k: number }
  | { kind: "skip"; i: number; value: number; prev: number; k: number }
  | { kind: "done"; k: number };

interface State {
  arr: number[]; // snapshot of the working array
  i: number; // read pointer (-1 = before/after the loop)
  k: number; // write pointer (next slot to write)
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: number } {
  const states: State[] = [];
  const arr = [...nums]; // mirror src mutation on a copy, never touch input
  let k = 1;

  states.push({ arr: [...arr], i: -1, k, log: { kind: "start" } });

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      arr[k] = arr[i];
      k++;
      states.push({
        arr: [...arr],
        i,
        k,
        log: { kind: "keep", i, value: arr[i], prev: arr[i - 1], k },
      });
    } else {
      states.push({
        arr: [...arr],
        i,
        k,
        log: { kind: "skip", i, value: arr[i], prev: arr[i - 1], k },
      });
    }
  }

  states.push({ arr: [...arr], i: -1, k, log: { kind: "done", k } });
  return { states, answer: k };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "start":
      return (
        <span className="done">
          k = 1 — nums[0] is always kept. Start scanning from i = 1.
        </span>
      );
    case "keep":
      return (
        <span className="ok">
          nums[{event.i}]={event.value} ≠ nums[{event.i - 1}]={event.prev} → write to
          slot {event.k - 1}, k→{event.k}.
        </span>
      );
    case "skip":
      return (
        <span className="cut">
          nums[{event.i}]={event.value} = nums[{event.i - 1}]={event.prev} → duplicate,
          skip, k stays {event.k}.
        </span>
      );
    case "done":
      return (
        <span className="done">
          Done. k = {event.k} (first k slots are the unique elements).
        </span>
      );
  }
}

function RemoveDuplicatesView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.arr.map((v, idx) => {
          const cls = ["cell"];
          if (idx < state.k) cls.push("in-window"); // unique region
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

const NUMS = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];

export function RemoveDuplicatesViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS), []);
  const expected = useMemo(() => removeDuplicates([...NUMS]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>removeDuplicates(nums=[{NUMS.join(",")}])</h1>
      <p className="legend">
        In-place dedup of a <b>sorted</b> array. <b className="c-right">Green</b> is{" "}
        <b>i</b> (read pointer, scans from index 1); <b className="c-left">yellow</b> is{" "}
        <b>k</b> (write pointer, the next slot to fill). Each step compares{" "}
        <code>nums[i]</code> with the previous element <code>nums[i-1]</code>: if they
        differ it is a new value — copy it to <code>nums[k]</code> and advance <b>k</b>;
        if equal it is a duplicate and is skipped. The first <b>k</b> cells (
        <b className="c-win">blue</b>) are the unique elements — that count is the answer.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <RemoveDuplicatesView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: the visualization gives ${answer}, and the real removeDuplicates from src/ also gives ${expected}.`
          : `✗ Mismatch: the visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
