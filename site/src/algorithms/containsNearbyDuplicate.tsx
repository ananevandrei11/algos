import { useMemo } from "react";
import { containsNearbyDuplicate } from "@algos/containsNearbyDuplicate/containsNearbyDuplicate";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | {
      kind: "step";
      i: number;
      val: number;
      prev: number | null;
      distance: number | null;
      outcome: "found" | "far" | "new";
    };

interface State {
  nums: number[];
  k: number;
  i: number;
  lastSeenEntries: [number, number][];
  found: boolean;
  log: LogEvent;
}

function buildStates(
  nums: number[],
  k: number
): { states: State[]; answer: boolean } {
  const states: State[] = [];
  const lastSeen = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const prev = lastSeen.get(nums[i]);
    if (prev !== undefined && i - prev <= k) {
      states.push({
        nums,
        k,
        i,
        lastSeenEntries: Array.from(lastSeen.entries()),
        found: true,
        log: {
          kind: "step",
          i,
          val: nums[i],
          prev,
          distance: i - prev,
          outcome: "found",
        },
      });
      return { states, answer: true };
    }
    lastSeen.set(nums[i], i);
    const outcome: "far" | "new" =
      prev !== undefined ? "far" : "new";
    states.push({
      nums,
      k,
      i,
      lastSeenEntries: Array.from(lastSeen.entries()),
      found: false,
      log: {
        kind: "step",
        i,
        val: nums[i],
        prev: prev ?? null,
        distance: prev !== undefined ? i - prev : null,
        outcome,
      },
    });
  }

  return { states, answer: false };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.outcome === "found") {
    return (
      <span>
        i={event.i}: <code>{event.val}</code> last seen at {event.prev},{" "}
        distance = {event.distance} ≤ k.{" "}
        <span className="ok">→ return true</span>
      </span>
    );
  }
  if (event.outcome === "far") {
    return (
      <span>
        i={event.i}: <code>{event.val}</code> last seen at {event.prev},{" "}
        distance = {event.distance} &gt; k. Update map → set {event.val} ={" "}
        {event.i}.
      </span>
    );
  }
  return (
    <span>
      i={event.i}: <code>{event.val}</code> not in map. Add {event.val} →{" "}
      {event.i}.
    </span>
  );
}

function ContainsNearbyDuplicateView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.nums.map((n, idx) => {
          const isCurrent = idx === state.i;
          const isDuplicate =
            state.found &&
            state.log.outcome === "found" &&
            (idx === state.i || idx === state.log.prev);
          const cls = ["cell"];
          if (isCurrent && !isDuplicate) cls.push("left-edge");
          return (
            <div
              className={cls.join(" ")}
              key={idx}
              style={{
                opacity: idx <= state.i ? 1 : 0.3,
                border: isDuplicate ? "2px solid #10b981" : undefined,
                background: isDuplicate ? "#062918" : undefined,
                color: isDuplicate ? "#10b981" : undefined,
              }}
            >
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

      <div style={{ marginTop: 24 }}>
        <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 8 }}>
          lastSeen (value → index):
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {state.lastSeenEntries.map(([val, idx]) => {
            const isActive =
              val === state.nums[state.i] &&
              (state.log.outcome === "found" || state.log.outcome === "far");
            return (
              <div
                key={val}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: `1px solid ${isActive ? "#f59e0b" : "#2a2e3a"}`,
                  background: isActive ? "#1e1a0f" : "#161922",
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    color: "#f59e0b",
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  {val}
                </span>
                <span style={{ color: "#5a5f6a" }}>→</span>
                <span
                  style={{
                    color: "#3b82f6",
                    fontFamily: "ui-monospace, monospace",
                  }}
                >
                  {idx}
                </span>
              </div>
            );
          })}
          {state.lastSeenEntries.length === 0 && (
            <span style={{ color: "#3a3f4a", fontSize: 13 }}>empty</span>
          )}
        </div>
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS = [1, 2, 3, 1];
const K = 3;

export function ContainsNearbyDuplicateViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS, K), []);
  const expected = useMemo(() => containsNearbyDuplicate(NUMS, K), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        containsNearbyDuplicate([{NUMS.join(", ")}], {K})
      </h1>
      <p className="legend">
        Scan left-to-right with pointer <b className="c-left">i</b>. For each
        element, check if it was seen before and its last index is within{" "}
        <code>k</code> of the current. Track the last index of each value in{" "}
        <code>lastSeen</code>.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <ContainsNearbyDuplicateView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
