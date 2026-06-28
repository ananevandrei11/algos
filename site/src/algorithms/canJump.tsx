import { useMemo } from "react";
import { canJump } from "@algos/canJump/canJump";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "step"; i: number; jump: number; prevMaxReach: number; newMaxReach: number }
  | { kind: "blocked"; i: number; maxReach: number }
  | { kind: "done"; result: boolean };

interface State {
  nums: number[];
  i: number;
  maxReach: number;
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: boolean } {
  const states: State[] = [];
  let maxReach = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) {
      states.push({ nums, i, maxReach, log: { kind: "blocked", i, maxReach } });
      return { states, answer: false };
    }
    const prevMaxReach = maxReach;
    maxReach = Math.max(maxReach, i + nums[i]);
    states.push({
      nums,
      i,
      maxReach,
      log: { kind: "step", i, jump: nums[i], prevMaxReach, newMaxReach: maxReach },
    });
  }

  states.push({
    nums,
    i: nums.length - 1,
    maxReach,
    log: { kind: "done", result: true },
  });
  return { states, answer: true };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "step") {
    return (
      <span>
        i={event.i}, jump={event.jump}: maxReach{" "}
        {event.newMaxReach > event.prevMaxReach ? (
          <>
            extended to <code>{event.newMaxReach}</code>
          </>
        ) : (
          <>
            stays at <code>{event.newMaxReach}</code>
          </>
        )}
        .
      </span>
    );
  }
  if (event.kind === "blocked") {
    return (
      <span className="fail">
        i={event.i} &gt; maxReach={event.maxReach} — can&apos;t reach this index.
        Return false.
      </span>
    );
  }
  return <span className="ok">Loop complete — all positions reachable. Return true.</span>;
}

function CanJumpView({ state }: { state: State }) {
  const showI = state.log.kind !== "done";
  const showMax = state.maxReach < state.nums.length;

  return (
    <>
      <div className="array">
        {state.nums.map((val, idx) => {
          const isI = showI && idx === state.i;
          const isMaxReach = showMax && idx === state.maxReach;
          const isReachable = idx <= state.maxReach;
          const cls = ["cell"];
          if (isI) cls.push("left-edge");
          if (isMaxReach && !isI) cls.push("right-edge");
          return (
            <div
              key={idx}
              className={cls.join(" ")}
              style={{ opacity: isReachable ? 1 : 0.35 }}
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
            {showI && idx === state.i && <span className="l">i</span>}
            {showMax && idx === state.maxReach && (
              <span className="r">max</span>
            )}
          </div>
        ))}
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS = [2, 3, 1, 1, 4];

export function CanJumpViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS), []);
  const expected = useMemo(() => canJump([...NUMS]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>canJump([{NUMS.join(", ")}])</h1>
      <p className="legend">
        Greedy scan: track <b className="c-right">maxReach</b> — the furthest index
        reachable so far. At each <b className="c-left">i</b>, if{" "}
        <code>i &gt; maxReach</code> we&apos;re stuck (return false); otherwise extend
        maxReach to <code>max(maxReach, i + nums[i])</code>. Dim cells are beyond
        current maxReach.
      </p>

      <StepPlayer states={states} render={(s) => <CanJumpView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
