import { useMemo } from "react";
import { removeElement } from "@algos/removeElement/removeElement";
import { StepPlayer } from "../components/StepPlayer";

// Frame trace of the in-place two-pointer removeElement from src/.
// `i` reads every element; `k` is the next write slot. When nums[i] !== val,
// the value is copied to nums[k] and k advances. States are plain DATA; the
// view renders them. The real src/ function is used only to verify the answer.

type LogEvent =
  | { kind: "keep"; i: number; value: number; k: number }
  | { kind: "skip"; i: number; value: number; val: number; k: number }
  | { kind: "done"; k: number };

interface State {
  arr: number[]; // snapshot of the working array
  i: number; // read pointer (-1 = before/after the loop)
  k: number; // write pointer (next slot to write)
  log: LogEvent;
}

function buildStates(
  nums: number[],
  val: number,
): { states: State[]; answer: number } {
  const states: State[] = [];
  const arr = [...nums]; // mirror src mutation on a copy, never touch input
  let k = 0;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] !== val) {
      arr[k] = arr[i];
      k++;
      states.push({
        arr: [...arr],
        i,
        k,
        log: { kind: "keep", i, value: arr[i], k },
      });
    } else {
      states.push({
        arr: [...arr],
        i,
        k,
        log: { kind: "skip", i, value: arr[i], val, k },
      });
    }
  }

  states.push({ arr: [...arr], i: -1, k, log: { kind: "done", k } });
  return { states, answer: k };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "keep":
      return (
        <span className="ok">
          nums[{event.i}]={event.value} ≠ val → write to slot {event.k - 1}, k→{event.k}.
        </span>
      );
    case "skip":
      return (
        <span className="cut">
          nums[{event.i}]={event.value} = val → skip, k stays {event.k}.
        </span>
      );
    case "done":
      return <span className="done">Done. k = {event.k} (first k slots are the kept elements).</span>;
  }
}

function RemoveElementView({
  val,
  state,
}: {
  val: number;
  state: State;
}) {
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
        <div className="stat target">
          val<b>{val}</b>
        </div>
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

const NUMS = [3, 2, 2, 3];
const VAL = 3;

export function RemoveElementViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS, VAL), []);
  const expected = useMemo(() => removeElement([...NUMS], VAL), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        removeElement(nums=[{NUMS.join(",")}], val={VAL})
      </h1>
      <p className="legend">
        In-place two pointers. <b className="c-right">Green</b> is <b>i</b> (read pointer,
        scans every element); <b className="c-left">yellow</b> is <b>k</b> (write pointer, the
        next slot to fill). When <code>nums[i] ≠ val</code>, copy it to <code>nums[k]</code> and
        advance <b>k</b>; otherwise skip. The first <b>k</b> cells (<b className="c-win">blue</b>)
        are the kept elements — that count is the answer.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <RemoveElementView val={VAL} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: the visualization gives ${answer}, and the real removeElement from src/ also gives ${expected}.`
          : `✗ Mismatch: the visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
