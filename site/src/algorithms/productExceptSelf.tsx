import { useMemo } from "react";
import { productExceptSelf } from "@algos/productExceptSelf/productExceptSelf";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "left"; i: number; left: number; resultVal: number }
  | { kind: "right"; i: number; right: number; before: number; after: number };

interface State {
  nums: number[];
  result: number[];
  phase: 1 | 2;
  i: number;
  left: number;
  right: number;
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: number[] } {
  const states: State[] = [];
  const result: number[] = new Array(nums.length);

  let left = 1;
  for (let i = 0; i < nums.length; i++) {
    result[i] = left;
    states.push({
      nums,
      result: [...result],
      phase: 1,
      i,
      left,
      right: 1,
      log: { kind: "left", i, left, resultVal: result[i] },
    });
    left *= nums[i];
  }

  let right = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    const before = result[i];
    result[i] *= right;
    states.push({
      nums,
      result: [...result],
      phase: 2,
      i,
      left,
      right,
      log: { kind: "right", i, right, before, after: result[i] },
    });
    right *= nums[i];
  }

  return { states, answer: result };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "left") {
    return (
      <span>
        Phase 1 — i={event.i}: result[{event.i}] = left ={" "}
        <code>{event.resultVal}</code>. left becomes left × nums[{event.i}].
      </span>
    );
  }
  return (
    <span>
      Phase 2 — i={event.i}: result[{event.i}] = {event.before} × right (
      {event.right}) ={" "}
      <code>{event.after}</code>. right becomes right × nums[{event.i}].
    </span>
  );
}

function ProductExceptSelfView({ state }: { state: State }) {
  return (
    <>
      <div style={{ marginBottom: 4, fontSize: 12, color: "#5a5f6a" }}>
        nums:
      </div>
      <div className="array" style={{ marginTop: 4 }}>
        {state.nums.map((n, idx) => {
          const isCurrent = idx === state.i;
          const cls = ["cell"];
          if (isCurrent) cls.push("left-edge");
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {n}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.nums.map((_, idx) => (
          <div className="ptr" key={idx}>
            {idx === state.i && <span className="l">i</span>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, marginBottom: 4, fontSize: 12, color: "#5a5f6a" }}>
        result:
      </div>
      <div className="array" style={{ marginTop: 4 }}>
        {state.result.map((n, idx) => {
          const isCurrent = idx === state.i;
          const isDefined = n !== undefined && n !== null;
          const cls = ["cell"];
          if (isCurrent && state.phase === 1) cls.push("in-window");
          if (isCurrent && state.phase === 2) cls.push("right-edge");
          return (
            <div
              className={cls.join(" ")}
              key={idx}
              style={{ opacity: isDefined ? 1 : 0.3 }}
            >
              <span className="idx">{idx}</span>
              {isDefined ? n : "?"}
            </div>
          );
        })}
      </div>

      <div className="stats" style={{ marginTop: 20 }}>
        <div className="stat target">
          <span>
            {state.phase === 1 ? "left" : "right"}
          </span>
          <b>{state.phase === 1 ? state.left : state.right}</b>
        </div>
        <div className="stat">
          <span>phase</span>
          <b style={{ color: state.phase === 1 ? "#3b82f6" : "#10b981" }}>
            {state.phase === 1 ? "left pass →" : "← right pass"}
          </b>
        </div>
      </div>

      <div className="log" style={{ marginTop: 8 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS = [1, 2, 3, 4];

export function ProductExceptSelfViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS), []);
  const expected = useMemo(() => productExceptSelf(NUMS), []);
  const ok =
    answer.length === expected.length &&
    answer.every((v, i) => v === expected[i]);

  return (
    <>
      <h1>productExceptSelf([{NUMS.join(", ")}])</h1>
      <p className="legend">
        Two passes. Left pass (→): fill <code>result[i]</code> with the running
        left product (product of all elements before i). Right pass (←):
        multiply <code>result[i]</code> by the running right product (product of
        all elements after i). No division needed.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <ProductExceptSelfView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives [${answer.join(", ")}], src/ also gives [${expected.join(", ")}].`
          : `✗ Mismatch: visualization says [${answer.join(", ")}], but src/ returns [${expected.join(", ")}].`}
      </p>
    </>
  );
}
