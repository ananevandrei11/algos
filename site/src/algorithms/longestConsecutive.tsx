import { useMemo } from "react";
import { longestConsecutive } from "@algos/longestConsecutive/longestConsecutive";
import { StepPlayer } from "../components/StepPlayer";

// Traces the exact longestConsecutive implementation from src/:
// Sort + deduplicate, then scan: if next === curr+1, extend the run (temp++);
// otherwise close it (temp++ then reset to 0). Track best (res) throughout.
// States are plain data; view shows sorted array + temp/res as key→value rows.

type LogEvent =
  | { kind: "sort"; sortedNums: number[] }
  | { kind: "scan"; i: number; curr: number; next: number | undefined; consecutive: boolean; temp: number; res: number }
  | { kind: "done"; answer: number };

interface State {
  sortedNums: number[];
  i: number;
  temp: number;
  res: number;
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: number } {
  const states: State[] = [];

  if (nums.length <= 1) {
    return { states, answer: nums.length };
  }

  const sortedNums = [...new Set(nums.sort((a, b) => a - b))];

  states.push({
    sortedNums,
    i: -1,
    temp: 0,
    res: 0,
    log: { kind: "sort", sortedNums },
  });

  let res = 0;
  let temp = 0;

  for (let i = 0; i < sortedNums.length; i += 1) {
    const curr = sortedNums[i];
    const next = sortedNums[i + 1];
    if (next !== undefined && curr + 1 === next) {
      temp += 1;
      res = Math.max(res, temp);
    } else {
      temp += 1;
      res = Math.max(res, temp);
      temp = 0;
    }
    states.push({
      sortedNums,
      i,
      temp,
      res,
      log: {
        kind: "scan",
        i,
        curr,
        next,
        consecutive: next !== undefined && curr + 1 === next,
        temp,
        res,
      },
    });
  }

  states.push({
    sortedNums,
    i: sortedNums.length,
    temp: 0,
    res,
    log: { kind: "done", answer: res },
  });

  return { states, answer: res };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "sort":
      return (
        <span>
          Sorted unique: [{event.sortedNums.join(", ")}]. Start scanning.
        </span>
      );
    case "scan":
      if (event.consecutive) {
        return (
          <span>
            i={event.i}: {event.curr}+1 = {event.next} → consecutive.{" "}
            <span className="ok">temp={event.temp}, res={event.res}</span>
          </span>
        );
      }
      return (
        <span>
          i={event.i}: {event.curr}+1 ≠{" "}
          {event.next !== undefined ? event.next : "end"}.{" "}
          Run closed: temp→{event.temp} then reset. res={event.res}
        </span>
      );
    case "done":
      return <span className="done">Done. Answer = {event.answer}.</span>;
  }
}

function LongestConsecutiveView({ nums, state }: { nums: number[]; state: State }) {
  return (
    <>
      <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 6 }}>
        Original nums: [{nums.join(", ")}]
      </div>

      <div className="array">
        {state.sortedNums.map((v, idx) => {
          const isCurrent = idx === state.i;
          const scanLog = state.log.kind === "scan" ? state.log : null;
          const isInRun =
            scanLog !== null &&
            scanLog.consecutive &&
            idx >= state.i - (state.temp - 1) &&
            idx <= state.i;
          const cls = ["cell"];
          if (isCurrent) cls.push("left-edge");
          if (isInRun && !isCurrent) cls.push("in-window");
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {v}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: 11, color: "#5a5f6a", marginBottom: 16 }}>
        sortedNums (deduplicated)
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
        {[
          { label: "temp", value: state.temp },
          { label: "res", value: state.res },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 6,
              border: "1px solid #2a2e3a",
              background: "#161922",
              fontSize: 13,
            }}
          >
            <span style={{ color: "#f59e0b", fontFamily: "ui-monospace, monospace" }}>
              {label}
            </span>
            <span style={{ color: "#5a5f6a" }}>→</span>
            <span style={{ color: "#3b82f6", fontFamily: "ui-monospace, monospace" }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS = [100, 4, 200, 1, 3, 2];

export function LongestConsecutiveViz() {
  const { states, answer } = useMemo(() => buildStates([...NUMS]), []);
  const expected = useMemo(() => longestConsecutive([...NUMS]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>longestConsecutive([{NUMS.join(", ")}])</h1>
      <p className="legend">
        Sort and deduplicate the array. Scan left to right: when{" "}
        <b className="c-left">curr+1 === next</b>, extend the run (<b>temp</b>++). When
        the run breaks, update <b>res</b> and reset <b>temp</b>. Return <b>res</b>.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <LongestConsecutiveView nums={NUMS} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ longestConsecutive also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
