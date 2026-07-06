import { useMemo } from "react";
import { searchInsert } from "@algos/searchInsert/searchInsert";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | {
      kind: "check";
      pivot: number;
      middle: number;
      target: number;
      decision: "found" | "go_right" | "go_left";
    }
  | { kind: "done"; result: number };

interface State {
  nums: number[];
  target: number;
  left: number;
  right: number;
  pivot: number; // -1 when loop has exited
  result: number | null;
  log: LogEvent;
}

function buildStates(
  nums: number[],
  target: number
): { states: State[]; answer: number } {
  const states: State[] = [];
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const pivot = Math.floor((left + right) / 2);
    const middle = nums[pivot];

    if (middle === target) {
      states.push({
        nums,
        target,
        left,
        right,
        pivot,
        result: pivot,
        log: { kind: "check", pivot, middle, target, decision: "found" },
      });
      return { states, answer: pivot };
    }
    if (middle < target) {
      states.push({
        nums,
        target,
        left,
        right,
        pivot,
        result: null,
        log: { kind: "check", pivot, middle, target, decision: "go_right" },
      });
      left = pivot + 1;
    } else {
      states.push({
        nums,
        target,
        left,
        right,
        pivot,
        result: null,
        log: { kind: "check", pivot, middle, target, decision: "go_left" },
      });
      right = pivot - 1;
    }
  }

  const result = Math.max(left, right);
  states.push({
    nums,
    target,
    left,
    right,
    pivot: -1,
    result,
    log: { kind: "done", result },
  });
  return { states, answer: result };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "check") {
    if (event.decision === "found") {
      return (
        <span>
          nums[{event.pivot}] = <code>{event.middle}</code> ==={" "}
          <code>{event.target}</code>{" "}
          <span className="ok">→ found, return {event.pivot}</span>
        </span>
      );
    }
    if (event.decision === "go_right") {
      return (
        <span>
          nums[{event.pivot}] = <code>{event.middle}</code> &lt;{" "}
          <code>{event.target}</code> → move <b className="c-left">L</b> to{" "}
          {event.pivot + 1}
        </span>
      );
    }
    return (
      <span>
        nums[{event.pivot}] = <code>{event.middle}</code> &gt;{" "}
        <code>{event.target}</code> → move <b className="c-right">R</b> to{" "}
        {event.pivot - 1}
      </span>
    );
  }
  return (
    <span>
      <code>left &gt; right</code> — loop done.{" "}
      <span className="ok">
        return Math.max(left, right) = {event.result}
      </span>
    </span>
  );
}

function SearchInsertView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.nums.map((n, idx) => {
          const inWindow =
            state.pivot !== -1 && idx >= state.left && idx <= state.right;
          const isPivot = idx === state.pivot;
          const cls = ["cell"];
          if (inWindow) cls.push("in-window");
          if (isPivot) cls.push("left-edge");
          return (
            <div
              className={cls.join(" ")}
              key={idx}
              style={{ opacity: inWindow || isPivot ? 1 : 0.35 }}
            >
              <span className="idx">{idx}</span>
              {n}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.nums.map((_, idx) => {
          const isL = idx === state.left;
          const isR = idx === state.right;
          const isP = idx === state.pivot;
          return (
            <div className="ptr" key={idx}>
              {isP && (
                <span style={{ color: "#f59e0b", display: "block" }}>P</span>
              )}
              {isL && !isP && <span className="l">L</span>}
              {isR && !isP && <span className="r">R</span>}
            </div>
          );
        })}
      </div>

      {state.result !== null && (
        <div style={{ marginTop: 20 }}>
          <span style={{ fontSize: 12, color: "#5a5f6a" }}>result:</span>
          <span
            style={{
              marginLeft: 8,
              padding: "4px 12px",
              borderRadius: 6,
              border: "2px solid #3b82f6",
              background: "#0e1e3f",
              fontSize: 15,
              fontFamily: "ui-monospace, monospace",
              color: "#3b82f6",
              display: "inline-block",
            }}
          >
            {state.result}
          </span>
        </div>
      )}

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS = [1, 3, 5, 6];
const TARGET = 2;

export function SearchInsertViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS, TARGET), []);
  const expected = useMemo(() => searchInsert(NUMS, TARGET), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        searchInsert([{NUMS.join(", ")}], {TARGET})
      </h1>
      <p className="legend">
        Binary search: maintain <b className="c-left">L</b>/<b className="c-right">R</b>{" "}
        window. Each iteration compute pivot <code>P = ⌊(L+R)/2⌋</code> and compare{" "}
        <code>nums[P]</code> to target. Narrow the window; if not found, return{" "}
        <code>Math.max(L, R)</code> as the insertion position.
      </p>

      <StepPlayer states={states} render={(s) => <SearchInsertView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
