import { useMemo } from "react";
import { minSubArrayLen } from "@algos/minSubArrayLen/minSubArrayLen";
import { StepPlayer } from "../components/StepPlayer";

// Frame generator + view for the O(n) sliding-window minSubArrayLen.
// States are plain DATA (indices, sums, a structured log event) — the view
// turns them into JSX. No HTML strings, no dangerouslySetInnerHTML.
// The real src/ function is imported only to verify the final answer.

type LogEvent =
  | { kind: "expand"; index: number; value: number; sum: number }
  | { kind: "hit"; sum: number; length: number; best: number; improved: boolean }
  | { kind: "shrink"; index: number; value: number; sum: number; left: number }
  | { kind: "done"; answer: number };

interface State {
  left: number;
  right: number;
  sum: number;
  best: number | null; // null = not found yet (Infinity)
  window: number[]; // indices currently in the window
  log: LogEvent;
}

function buildStates(
  target: number,
  nums: number[],
): { states: State[]; answer: number } {
  const states: State[] = [];
  const windowOf = (l: number, r: number) =>
    l <= r ? Array.from({ length: r - l + 1 }, (_, k) => l + k) : [];

  let res = Infinity;
  let sum = 0;
  let left = 0;

  const best = () => (res === Infinity ? null : res);

  for (let right = 0; right < nums.length; right += 1) {
    sum += nums[right];
    states.push({
      left,
      right,
      sum,
      best: best(),
      window: windowOf(left, right),
      log: { kind: "expand", index: right, value: nums[right], sum },
    });

    while (sum >= target) {
      const length = right - left + 1;
      const improved = length < res;
      res = Math.min(res, length);
      states.push({
        left,
        right,
        sum,
        best: best(),
        window: windowOf(left, right),
        log: { kind: "hit", sum, length, best: res, improved },
      });

      const value = nums[left];
      sum -= value;
      left += 1;
      states.push({
        left,
        right,
        sum,
        best: best(),
        window: windowOf(left, right),
        log: { kind: "shrink", index: left - 1, value, sum, left },
      });
    }
  }

  const answer = res === Infinity ? 0 : res;
  states.push({
    left,
    right: nums.length - 1,
    sum,
    best: best(),
    window: [],
    log: { kind: "done", answer },
  });

  return { states, answer };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "expand":
      return (
        <>
          <span className="ok">
            right→{event.index}: +nums[{event.index}]={event.value} → sum={event.sum}
          </span>
        </>
      );
    case "hit":
      return (
        <>
          <span className="hit">
            sum={event.sum} ≥ target! Window of length {event.length}.
          </span>{" "}
          {event.improved ? `New minimum best=${event.best}.` : `Not shorter (best=${event.best}).`}
        </>
      );
    case "shrink":
      return (
        <span className="cut">
          left→{event.left}: dropped nums[{event.index}]={event.value} → sum={event.sum}.
        </span>
      );
    case "done":
      return <span className="done">Done. Answer = {event.answer}.</span>;
  }
}

function MinSubView({
  nums,
  target,
  state,
}: {
  nums: number[];
  target: number;
  state: State;
}) {
  return (
    <>
      <div className="array">
        {nums.map((v, k) => {
          const cls = ["cell"];
          if (state.window.includes(k)) cls.push("in-window");
          if (k === state.left && state.left <= state.right) cls.push("left-edge");
          if (k === state.right) cls.push("right-edge");
          return (
            <div className={cls.join(" ")} key={k}>
              <span className="idx">{k}</span>
              {v}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {nums.map((_, k) => {
          const l = k === state.left && state.left <= state.right;
          const r = k === state.right;
          return (
            <div className="ptr" key={k}>
              {l && <span className="l">L</span>}
              {l && r ? "/" : ""}
              {r && <span className="r">R</span>}
            </div>
          );
        })}
      </div>

      <div className="stats">
        <div className="stat target">
          target<b>{target}</b>
        </div>
        <div className="stat sum">
          sum<b>{state.sum}</b>
        </div>
        <div className="stat best">
          best<b>{state.best ?? "∞"}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const TARGET = 7;
const NUMS = [2, 3, 1, 2, 4, 3];

export function MinSubArrayLenViz() {
  const { states, answer } = useMemo(() => buildStates(TARGET, NUMS), []);
  const expected = useMemo(() => minSubArrayLen(TARGET, NUMS), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        minSubArrayLen(target={TARGET}, nums=[{NUMS.join(",")}])
      </h1>
      <p className="legend">
        Sliding window. The <b className="c-left">yellow frame</b> is <b>left</b> (window start),{" "}
        the <b className="c-right">green</b> is <b>right</b> (window end), the{" "}
        <b className="c-win">blue cells</b> are what's in the window now, and their sum is <b>sum</b>.
        Grow right; while sum ≥ target, record the length and shrink from the left. The shortest such
        window is the answer.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <MinSubView nums={NUMS} target={TARGET} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: the visualization gives ${answer}, and the real minSubArrayLen from src/ also gives ${expected}.`
          : `✗ Mismatch: the visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
