import { useMemo } from "react";
import { threeSum } from "@algos/threeSum/threeSum";
import { StepPlayer } from "../components/StepPlayer";

// Mirror quicksort from src/ to produce the same sorted array in buildStates
function quicksort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];
  const left: number[] = [];
  const right: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (i === pivotIndex) continue;
    if (arr[i] < pivot) left.push(arr[i]);
    else right.push(arr[i]);
  }
  return [...quicksort(left), pivot, ...quicksort(right)];
}

type LogEvent =
  | { kind: "skip_i"; one: number }
  | { kind: "sum_lt"; one: number; two: number; three: number; sum: number }
  | { kind: "sum_gt"; one: number; two: number; three: number; sum: number }
  | { kind: "found"; one: number; two: number; three: number };

interface State {
  sorted: readonly number[];
  i: number;
  left: number;
  right: number;
  res: readonly (readonly number[])[];
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: number[][] } {
  const states: State[] = [];
  const sortedNums = quicksort(nums);
  const res: number[][] = [];

  for (let i = 0; i < sortedNums.length; i++) {
    const one = sortedNums[i];
    if (i > 0 && sortedNums[i] === sortedNums[i - 1]) {
      states.push({
        sorted: sortedNums,
        i,
        left: i + 1,
        right: sortedNums.length - 1,
        res: res.map((t) => [...t]),
        log: { kind: "skip_i", one },
      });
      continue;
    }
    let left = i + 1;
    let right = sortedNums.length - 1;
    while (left < right) {
      const two = sortedNums[left];
      const three = sortedNums[right];
      const sum = one + three + two;
      if (sum < 0) {
        states.push({
          sorted: sortedNums,
          i,
          left,
          right,
          res: res.map((t) => [...t]),
          log: { kind: "sum_lt", one, two, three, sum },
        });
        left++;
      } else if (sum > 0) {
        states.push({
          sorted: sortedNums,
          i,
          left,
          right,
          res: res.map((t) => [...t]),
          log: { kind: "sum_gt", one, two, three, sum },
        });
        right--;
      } else {
        res.push([one, two, three]);
        states.push({
          sorted: sortedNums,
          i,
          left,
          right,
          res: res.map((t) => [...t]),
          log: { kind: "found", one, two, three },
        });
        left++;
        right--;
        while (left < right && sortedNums[left] === sortedNums[left - 1]) left++;
        while (left < right && sortedNums[right] === sortedNums[right + 1]) right--;
      }
    }
  }

  return { states, answer: res };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "skip_i":
      return (
        <span>
          one={event.one} equals previous element → skip (duplicate outer).
        </span>
      );
    case "sum_lt":
      return (
        <span>
          {event.one} + {event.two} + {event.three} = {event.sum} &lt; 0 → L moves
          right.
        </span>
      );
    case "sum_gt":
      return (
        <span>
          {event.one} + {event.two} + {event.three} = {event.sum} &gt; 0 → R moves
          left.
        </span>
      );
    case "found":
      return (
        <span className="ok">
          {event.one} + {event.two} + {event.three} = 0 → triplet [
          {event.one},{event.two},{event.three}] added.
        </span>
      );
  }
}

function ThreeSumView({ state }: { state: State }) {
  const isFound = state.log.kind === "found";
  return (
    <>
      <div className="array">
        {state.sorted.map((v, idx) => {
          const isI = idx === state.i;
          const isL = idx === state.left;
          const isR = idx === state.right;
          const cls = ["cell"];
          if (isFound && (isI || isL || isR)) {
            cls.push("in-window");
          } else {
            if (isI) cls.push("left-edge");
            if (isR) cls.push("right-edge");
          }
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {v}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.sorted.map((_, idx) => (
          <div className="ptr" key={idx}>
            {idx === state.i && <span className="l">i</span>}
            {idx === state.left && (
              <span style={{ color: "#3b82f6" }}>L</span>
            )}
            {idx === state.right && <span className="r">R</span>}
          </div>
        ))}
      </div>

      {state.res.length > 0 && (
        <div className="stats">
          <div className="stat">
            result{" "}
            <b>[{state.res.map((t) => `[${t.join(",")}]`).join(", ")}]</b>
          </div>
        </div>
      )}

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS = [-1, 0, 1, 2, -1, -4];

function normTriplets(arr: number[][]): string {
  return JSON.stringify(
    arr
      .map((t) => [...t].sort((a, b) => a - b))
      .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])
  );
}

export function ThreeSumViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS), []);
  const expected = useMemo(() => threeSum([...NUMS]), []);
  const ok = normTriplets(answer) === normTriplets(expected);

  return (
    <>
      <h1>threeSum(nums=[{NUMS.join(", ")}])</h1>
      <p className="legend">
        Input sorted via quicksort, then <b className="c-left">i</b> (yellow) fixes the
        first element while two pointers <b className="c-win">L</b> (blue) and{" "}
        <b className="c-right">R</b> (green) close in from both ends. Sum &lt; 0 →
        L right; sum &gt; 0 → R left; sum = 0 → triplet found. Duplicate i and
        duplicate pointer positions after a match are skipped.
      </p>

      <StepPlayer states={states} render={(s) => <ThreeSumView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: the visualization gives ${normTriplets(answer)}, and the real threeSum from src/ also gives ${normTriplets(expected)}.`
          : `✗ Mismatch: the visualization says ${normTriplets(answer)}, but src/ returns ${normTriplets(expected)}.`}
      </p>
    </>
  );
}
