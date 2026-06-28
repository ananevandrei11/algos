import { useMemo } from "react";
import { jump } from "@algos/jump/jump";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "step"; i: number; farthest: number }
  | { kind: "jump"; i: number; newJumps: number; newCurrentEnd: number }
  | { kind: "done"; jumps: number };

interface State {
  nums: number[];
  i: number;
  farthest: number;
  currentEnd: number;
  jumps: number;
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: number } {
  const states: State[] = [];
  let jumps = 0;
  let currentEnd = 0;
  let farthest = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);

    if (i === currentEnd) {
      jumps++;
      currentEnd = farthest;
      states.push({
        nums,
        i,
        farthest,
        currentEnd,
        jumps,
        log: { kind: "jump", i, newJumps: jumps, newCurrentEnd: currentEnd },
      });
    } else {
      states.push({
        nums,
        i,
        farthest,
        currentEnd,
        jumps,
        log: { kind: "step", i, farthest },
      });
    }
  }

  states.push({
    nums,
    i: nums.length - 1,
    farthest,
    currentEnd,
    jumps,
    log: { kind: "done", jumps },
  });

  return { states, answer: jumps };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "step") {
    return (
      <span>
        i={event.i}: farthest extended to <code>{event.farthest}</code>. Still
        within current jump level.
      </span>
    );
  }
  if (event.kind === "jump") {
    return (
      <span>
        i={event.i} reached level boundary — jump #{event.newJumps}. New level
        end: <code>{event.newCurrentEnd}</code>.
      </span>
    );
  }
  return (
    <span className="ok">
      Done. Minimum jumps to reach end: <code>{event.jumps}</code>.
    </span>
  );
}

function JumpView({ state }: { state: State }) {
  const isDone = state.log.kind === "done";
  const showFarthest =
    !isDone && state.farthest < state.nums.length;

  return (
    <>
      <div className="array">
        {state.nums.map((val, idx) => {
          const isI = !isDone && idx === state.i;
          const isFarthest = showFarthest && idx === state.farthest;
          const isLevelEnd = idx === state.currentEnd && !isDone;
          const isReachable = idx <= state.farthest;
          const cls = ["cell"];
          if (isI) cls.push("left-edge");
          if (isFarthest && !isI) cls.push("right-edge");
          return (
            <div
              key={idx}
              className={cls.join(" ")}
              style={{
                opacity: isReachable ? 1 : 0.35,
                background: isLevelEnd && !isI ? "#1e1b3a" : undefined,
                outline:
                  isLevelEnd && !isI ? "1px dashed #5b4fc4" : undefined,
              }}
            >
              <span className="idx">{idx}</span>
              {val}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.nums.map((_, idx) => (
          <div className="ptr" key={idx}>
            {!isDone && idx === state.i && <span className="l">i</span>}
            {showFarthest && idx === state.farthest && (
              <span className="r">far</span>
            )}
            {!isDone && idx === state.currentEnd && idx !== state.i && (
              <span style={{ color: "#8a7fe8", fontSize: 10 }}>end</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, fontSize: 13, color: "#9ca3af" }}>
        jumps: <b style={{ color: "#e2e8f0" }}>{state.jumps}</b>
        {"  "}currentEnd:{" "}
        <b style={{ color: "#e2e8f0" }}>{state.currentEnd}</b>
      </div>

      <div className="log" style={{ marginTop: 12 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS = [2, 3, 1, 1, 4];

export function JumpViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS), []);
  const expected = useMemo(() => jump([...NUMS]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>jump([{NUMS.join(", ")}])</h1>
      <p className="legend">
        Greedy BFS in one pass. <b className="c-left">i</b> scans left to right
        tracking <b className="c-right">farthest</b> reachable index. When{" "}
        <b>i</b> reaches the current level boundary (<b>end</b>), take a jump and
        extend the boundary to <b>farthest</b>. Dim cells are beyond farthest.
      </p>

      <StepPlayer states={states} render={(s) => <JumpView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
