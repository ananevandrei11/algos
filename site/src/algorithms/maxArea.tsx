import { useMemo } from "react";
import { maxArea } from "@algos/maxArea/maxArea";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "move_left"; leftH: number; rightH: number; width: number; vol: number; isNewMax: boolean }
  | { kind: "move_right"; leftH: number; rightH: number; width: number; vol: number; isNewMax: boolean };

interface State {
  height: readonly number[];
  evalLeft: number;
  evalRight: number;
  left: number;
  right: number;
  max: number;
  vol: number;
  log: LogEvent;
}

function buildStates(height: number[]): { states: State[]; answer: number } {
  const states: State[] = [];
  let max = 0;
  let left = 0;
  let right = height.length - 1;
  while (left < right) {
    const leftHeight = height[left];
    const rightHeight = height[right];
    const currHeight = leftHeight >= rightHeight ? rightHeight : leftHeight;
    const betweenIndex = right - left;
    const evalLeft = left;
    const evalRight = right;
    if (leftHeight >= rightHeight) {
      right--;
    } else {
      left++;
    }
    const volume = currHeight * betweenIndex;
    const isNewMax = volume > max;
    if (isNewMax) {
      max = volume;
    }
    const movedLeft = leftHeight < rightHeight;
    states.push({
      height,
      evalLeft,
      evalRight,
      left,
      right,
      max,
      vol: volume,
      log: movedLeft
        ? { kind: "move_left", leftH: leftHeight, rightH: rightHeight, width: betweenIndex, vol: volume, isNewMax }
        : { kind: "move_right", leftH: leftHeight, rightH: rightHeight, width: betweenIndex, vol: volume, isNewMax },
    });
  }
  return { states, answer: max };
}

function LogLine({ event }: { event: LogEvent }) {
  const moved = event.kind === "move_left" ? "L moves right" : "R moves left";
  const minH = Math.min(event.leftH, event.rightH);
  return (
    <span className={event.isNewMax ? "ok" : undefined}>
      h[L]={event.leftH}, h[R]={event.rightH} → min={minH} × width={event.width} ={" "}
      {event.vol}
      {event.isNewMax ? ` → new max=${event.vol}` : ""} → {moved}.
    </span>
  );
}

function MaxAreaView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.height.map((v, idx) => {
          const isL = idx === state.evalLeft;
          const isR = idx === state.evalRight;
          const cls = ["cell"];
          if (isL) cls.push("left-edge");
          if (isR) cls.push("right-edge");
          if (!isL && !isR && idx > state.evalLeft && idx < state.evalRight)
            cls.push("in-window");
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {v}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.height.map((_, idx) => (
          <div className="ptr" key={idx}>
            {idx === state.evalLeft && <span className="l">L</span>}
            {idx === state.evalRight && <span className="r">R</span>}
          </div>
        ))}
      </div>

      <div className="stats">
        <div className="stat">
          vol <b>{state.vol}</b>
        </div>
        <div className="stat">
          max <b>{state.max}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const HEIGHT = [1, 8, 6, 2, 5, 4, 8, 3, 7];

export function MaxAreaViz() {
  const { states, answer } = useMemo(() => buildStates(HEIGHT), []);
  const expected = useMemo(() => maxArea([...HEIGHT]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>maxArea(height=[{HEIGHT.join(", ")}])</h1>
      <p className="legend">
        Two-pointer approach: <b className="c-left">L</b> (yellow) starts at index 0,{" "}
        <b className="c-right">R</b> (green) starts at the last index. Each step computes{" "}
        <code>min(h[L], h[R]) × (R − L)</code> as the candidate area, then the shorter
        bar's pointer advances inward. <b>max</b> tracks the best area seen so far.
      </p>

      <StepPlayer states={states} render={(s) => <MaxAreaView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: the visualization gives ${answer}, and the real maxArea from src/ also gives ${expected}.`
          : `✗ Mismatch: the visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
