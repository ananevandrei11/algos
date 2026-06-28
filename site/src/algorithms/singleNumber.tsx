import { useMemo } from "react";
import { singleNumber } from "@algos/singleNumber/singleNumber";
import { StepPlayer } from "../components/StepPlayer";

// Traces the exact singleNumber implementation from src/:
// Use a Map as a set: if num is already in the map, delete it (seen twice);
// otherwise add it with value 1. The lone survivor stays in the map.
// States are plain data; view shows the map as key→value rows.

type LogEvent =
  | { kind: "scan"; i: number; num: number; action: "add" | "delete" }
  | { kind: "done"; answer: number };

interface State {
  i: number;
  mapEntries: [number, number][];
  currentNum: number | null;
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: number } {
  const states: State[] = [];

  if (nums.length === 1) {
    states.push({
      i: 0,
      mapEntries: [],
      currentNum: nums[0],
      log: { kind: "done", answer: nums[0] },
    });
    return { states, answer: nums[0] };
  }

  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i += 1) {
    const is = map.get(nums[i]);
    if (is) {
      map.delete(nums[i]);
      states.push({
        i,
        mapEntries: Array.from(map.entries()),
        currentNum: nums[i],
        log: { kind: "scan", i, num: nums[i], action: "delete" },
      });
    } else {
      map.set(nums[i], 1);
      states.push({
        i,
        mapEntries: Array.from(map.entries()),
        currentNum: nums[i],
        log: { kind: "scan", i, num: nums[i], action: "add" },
      });
    }
  }

  const res = [...map].flat();
  const answer = res[0] as number;

  states.push({
    i: nums.length,
    mapEntries: Array.from(map.entries()),
    currentNum: null,
    log: { kind: "done", answer },
  });

  return { states, answer };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "scan":
      if (event.action === "add") {
        return (
          <span>
            i={event.i}: <code>{event.num}</code> not in map.{" "}
            <span className="ok">map.set({event.num}, 1)</span>
          </span>
        );
      }
      return (
        <span>
          i={event.i}: <code>{event.num}</code> already in map.{" "}
          <span className="cut">map.delete({event.num})</span>
        </span>
      );
    case "done":
      return <span className="done">Done. Answer = {event.answer}.</span>;
  }
}

function SingleNumberView({ nums, state }: { nums: number[]; state: State }) {
  return (
    <>
      <div className="array">
        {nums.map((v, idx) => {
          const isCurrent = idx === state.i;
          return (
            <div
              className={["cell", isCurrent ? "left-edge" : ""].join(" ")}
              key={idx}
              style={{ opacity: idx > state.i ? 0.3 : 1 }}
            >
              <span className="idx">{idx}</span>
              {v}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 8 }}>
          map (num → 1, survivor tracking):
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {state.mapEntries.map(([k, v]) => {
            const isJustAdded =
              state.log.kind === "scan" &&
              state.log.action === "add" &&
              k === state.currentNum;
            return (
              <div
                key={k}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: `1px solid ${isJustAdded ? "#f59e0b" : "#2a2e3a"}`,
                  background: isJustAdded ? "#1e1a0f" : "#161922",
                  fontSize: 13,
                }}
              >
                <span
                  style={{ color: "#f59e0b", fontFamily: "ui-monospace, monospace" }}
                >
                  {k}
                </span>
                <span style={{ color: "#5a5f6a" }}>→</span>
                <span
                  style={{ color: "#3b82f6", fontFamily: "ui-monospace, monospace" }}
                >
                  {v}
                </span>
              </div>
            );
          })}
          {state.mapEntries.length === 0 && (
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

const NUMS = [4, 1, 2, 1, 2];

export function SingleNumberViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS), []);
  const expected = useMemo(() => singleNumber(NUMS), []);
  const ok = answer === expected;

  return (
    <>
      <h1>singleNumber([{NUMS.join(", ")}])</h1>
      <p className="legend">
        Use a Map as a presence set. For each number: if it's already in the map,{" "}
        <b className="cut">delete</b> it (seen twice). Otherwise <b className="ok">add</b>{" "}
        it with value 1. After the scan, the sole survivor in the map is the single number.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <SingleNumberView nums={NUMS} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ singleNumber also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
