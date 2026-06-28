import { useMemo } from "react";
import { majorityElement } from "@algos/majorityElement/majorityElement";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "match"; i: number; val: number; count: number }
  | { kind: "cancel"; i: number; val: number; count: number }
  | { kind: "new-candidate"; i: number; val: number }
  | { kind: "done"; candidate: number };

interface State {
  nums: number[];
  i: number;
  candidate: number;
  count: number;
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: number } {
  const states: State[] = [];
  let candidate = nums[0];
  let count = 1;

  for (let i = 0; i < nums.length; i += 1) {
    const curr = nums[i];
    if (candidate === curr) {
      count += 1;
      states.push({
        nums,
        i,
        candidate,
        count,
        log: { kind: "match", i, val: curr, count },
      });
    } else {
      count -= 1;
      if (count === 0) {
        candidate = curr;
        count = 1;
        states.push({
          nums,
          i,
          candidate,
          count,
          log: { kind: "new-candidate", i, val: curr },
        });
      } else {
        states.push({
          nums,
          i,
          candidate,
          count,
          log: { kind: "cancel", i, val: curr, count },
        });
      }
    }
  }

  states.push({
    nums,
    i: nums.length - 1,
    candidate,
    count,
    log: { kind: "done", candidate },
  });

  return { states, answer: candidate };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "match") {
    return (
      <span>
        nums[{event.i}]={event.val} matches candidate — count →{" "}
        <code>{event.count}</code>.
      </span>
    );
  }
  if (event.kind === "cancel") {
    return (
      <span>
        nums[{event.i}]={event.val} differs — count → <code>{event.count}</code>
        .
      </span>
    );
  }
  if (event.kind === "new-candidate") {
    return (
      <span>
        Count hit 0. New candidate: <code>{event.val}</code>, count reset to 1.
      </span>
    );
  }
  return (
    <span className="ok">
      Done. Majority element: <code>{event.candidate}</code>.
    </span>
  );
}

function MajorityElementView({ state }: { state: State }) {
  const isDone = state.log.kind === "done";

  return (
    <>
      <div className="array">
        {state.nums.map((val, idx) => {
          const isI = !isDone && idx === state.i;
          const isCandidate = val === state.candidate;
          const cls = ["cell"];
          if (isI) cls.push("left-edge");
          return (
            <div
              key={idx}
              className={cls.join(" ")}
              style={{ opacity: isCandidate ? 1 : 0.5 }}
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
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, fontSize: 13, color: "#9ca3af" }}>
        candidate:{" "}
        <b style={{ color: "#e2e8f0" }}>{state.candidate}</b>
        {"    "}count: <b style={{ color: "#e2e8f0" }}>{state.count}</b>
      </div>

      <div className="log" style={{ marginTop: 12 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS = [2, 2, 1, 1, 1, 2, 2];

export function MajorityElementViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS), []);
  const expected = useMemo(() => majorityElement([...NUMS]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>majorityElement([{NUMS.join(", ")}])</h1>
      <p className="legend">
        Boyer-Moore voting. Keep a <b>candidate</b> and a <b>count</b>. Matching
        element increments count; a different element decrements it. When count
        hits 0, adopt the new element as candidate. Dim cells hold a value that
        differs from the current candidate.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <MajorityElementView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
