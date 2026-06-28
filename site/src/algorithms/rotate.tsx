import { useMemo } from "react";
import { rotate } from "@algos/rotate/rotate";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "init"; kOrig: number; k: number }
  | { kind: "swap"; phase: 1 | 2 | 3; left: number; right: number }
  | { kind: "phase-done"; phase: 1 | 2 | 3 }
  | { kind: "done"; result: number[] };

interface State {
  nums: number[];
  phase: 0 | 1 | 2 | 3;
  left: number;
  right: number;
  log: LogEvent;
}

const NUMS = [1, 2, 3, 4, 5, 6, 7];
const K = 3;

function buildStates(numsInput: number[], kInput: number): { states: State[]; answer: number[] } {
  const states: State[] = [];
  const nums = [...numsInput];

  // mirrors src/rotate/rotate.ts exactly
  let k = kInput % nums.length;

  states.push({
    nums: [...nums],
    phase: 0,
    left: -1,
    right: -1,
    log: { kind: "init", kOrig: kInput, k },
  });

  if (k === 0) {
    states.push({
      nums: [...nums],
      phase: 0,
      left: -1,
      right: -1,
      log: { kind: "done", result: [...nums] },
    });
    return { states, answer: [...nums] };
  }

  const reverseSegment = (
    arr: number[],
    left: number,
    right: number,
    phase: 1 | 2 | 3
  ) => {
    while (left < right) {
      const temp = arr[left];
      arr[left] = arr[right];
      arr[right] = temp;
      states.push({
        nums: [...arr],
        phase,
        left,
        right,
        log: { kind: "swap", phase, left, right },
      });
      left++;
      right--;
    }
    states.push({
      nums: [...arr],
      phase,
      left: -1,
      right: -1,
      log: { kind: "phase-done", phase },
    });
  };

  const n = nums.length - 1;
  reverseSegment(nums, 0, n, 1);
  reverseSegment(nums, 0, k - 1, 2);
  reverseSegment(nums, k, n, 3);

  states.push({
    nums: [...nums],
    phase: 3,
    left: -1,
    right: -1,
    log: { kind: "done", result: [...nums] },
  });

  return { states, answer: [...nums] };
}

const PHASE_LABEL: Record<1 | 2 | 3, string> = {
  1: "Phase 1: reverse entire array [0, n]",
  2: "Phase 2: reverse first k elements [0, k-1]",
  3: "Phase 3: reverse tail [k, n]",
};

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "init":
      return (
        <span className="ok">
          k = {event.kOrig} % {NUMS.length} = {event.k}. Starting three-phase reverse.
        </span>
      );
    case "swap":
      return (
        <span className="ok">
          {PHASE_LABEL[event.phase]}: swap nums[{event.left}] ↔ nums[{event.right}]
        </span>
      );
    case "phase-done":
      return (
        <span className="ok">
          {PHASE_LABEL[event.phase]} — complete.
        </span>
      );
    case "done":
      return <span className="done">Done. [{event.result.join(", ")}]</span>;
  }
}

function RotateView({
  nums: original,
  k,
  state,
}: {
  nums: number[];
  k: number;
  state: State;
}) {
  return (
    <>
      <div className="array">
        {state.nums.map((val, i) => {
          const isLeft = i === state.left;
          const isRight = i === state.right;
          const isActive = isLeft || isRight;
          const isPhase2Range =
            state.phase === 2 && state.left >= 0 && i >= 0 && i <= k - 1;
          const isPhase3Range =
            state.phase === 3 && state.left >= 0 && i >= k && i <= original.length - 1;
          const isPhase1Range =
            state.phase === 1 && state.left >= 0;

          const cls = ["cell"];
          if (isActive) cls.push("active");
          else if (
            (isPhase1Range || isPhase2Range || isPhase3Range) &&
            i >= state.left &&
            i <= state.right
          )
            cls.push("in-window");

          return (
            <div className={cls.join(" ")} key={i}>
              <span className="idx">{i}</span>
              {val}
              {isLeft && <span className="ptr ptr-top">L</span>}
              {isRight && <span className="ptr ptr-top">R</span>}
            </div>
          );
        })}
      </div>

      <div className="stats">
        <div className="stat">
          k<b style={{ color: "#f59e0b" }}>{k}</b>
        </div>
        <div className="stat">
          phase
          <b style={{ color: "#10b981" }}>
            {state.phase === 0 ? "—" : state.phase}
          </b>
        </div>
        {state.left >= 0 && (
          <>
            <div className="stat">
              L<b style={{ color: "#3b82f6" }}>{state.left}</b>
            </div>
            <div className="stat">
              R<b style={{ color: "#ef4444" }}>{state.right}</b>
            </div>
          </>
        )}
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

export function RotateViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS, K), []);
  const expected = useMemo(() => {
    const arr = [...NUMS];
    rotate(arr, K);
    return arr;
  }, []);
  const ok = JSON.stringify(answer) === JSON.stringify(expected);

  return (
    <>
      <h1>rotate([1,2,3,4,5,6,7], k=3)</h1>
      <p className="legend">
        Three-phase in-place rotation. <b>Phase 1:</b> reverse the entire array.{" "}
        <b>Phase 2:</b> reverse the first <b style={{ color: "#f59e0b" }}>k</b> elements.{" "}
        <b>Phase 3:</b> reverse the remaining elements from index k to end. The{" "}
        <b style={{ color: "#3b82f6" }}>L</b> and <b style={{ color: "#ef4444" }}>R</b> labels
        mark the two pointers being swapped; highlighted cells are inside the current segment.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <RotateView nums={NUMS} k={K} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives [${answer.join(", ")}], and the real rotate from src/ also gives [${expected.join(", ")}].`
          : `✗ Mismatch: visualization says [${answer.join(", ")}], but src/ returns [${expected.join(", ")}].`}
      </p>
    </>
  );
}
