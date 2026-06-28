import { useMemo } from "react";
import { summaryRanges } from "@algos/summaryRanges/summaryRanges";
import { StepPlayer } from "../components/StepPlayer";

// Frame generator + view for summaryRanges.
// States are plain DATA — the view turns them into JSX.
// No HTML strings, no dangerouslySetInnerHTML.
// The real src/ function is imported only to verify the final answer.

const GROUP_COLORS = ["#3b82f6", "#a78bfa", "#f59e0b", "#10b981", "#ef4444"];
const groupColor = (g: number) => GROUP_COLORS[(g - 1) % GROUP_COLORS.length];

type LogEvent =
  | { kind: "start-group"; curr: number; indicator: number }
  | { kind: "extend"; curr: number; prev: number; indicator: number }
  | { kind: "new-group"; curr: number; prev: number; indicator: number }
  | { kind: "build-range"; index: number; str: string; group: number[] }
  | { kind: "build-single"; index: number; str: string; value: number }
  | { kind: "done"; result: string[] };

interface State {
  phase: "group" | "build" | "done";
  i: number;
  indicator: number;
  groups: [number, number[]][]; // Map entries as plain array (Map is not plain data)
  values: number[][];
  res: string[];
  log: LogEvent;
}

function buildStates(nums: number[]): { states: State[]; answer: string[] } {
  const states: State[] = [];
  // Mirror src exactly
  const map = new Map<number, number[]>();
  let indicator = 1;

  const snapGroups = (): [number, number[]][] =>
    [...map.entries()].map(([k, v]) => [k, [...v]]);
  const snapValues = (): number[][] => [...map.values()].map((v) => [...v]);

  for (let i = 0; i < nums.length; i += 1) {
    const curr = nums[i];
    if (map.size === 0) {
      map.set(indicator, [curr]);
      states.push({
        phase: "group",
        i,
        indicator,
        groups: snapGroups(),
        values: snapValues(),
        res: [],
        log: { kind: "start-group", curr, indicator },
      });
      continue;
    }
    const prev = nums[i - 1];
    if (prev === curr - 1) {
      const currIndicator = map.get(indicator) || [];
      currIndicator?.push(curr);
      map.set(indicator, currIndicator);
      states.push({
        phase: "group",
        i,
        indicator,
        groups: snapGroups(),
        values: snapValues(),
        res: [],
        log: { kind: "extend", curr, prev, indicator },
      });
    } else {
      indicator += 1;
      map.set(indicator, [curr]);
      states.push({
        phase: "group",
        i,
        indicator,
        groups: snapGroups(),
        values: snapValues(),
        res: [],
        log: { kind: "new-group", curr, prev, indicator },
      });
    }
  }

  const values = [...map.values()].map((v) => [...v]);
  const res: string[] = [];

  for (let i = 0; i < values.length; i += 1) {
    if (values[i].length === 1) {
      res.push(values[i][0].toString());
      states.push({
        phase: "build",
        i,
        indicator,
        groups: snapGroups(),
        values: values.map((v) => [...v]),
        res: [...res],
        log: {
          kind: "build-single",
          index: i,
          str: values[i][0].toString(),
          value: values[i][0],
        },
      });
    } else {
      const str = `${values[i][0]}->${values[i][values[i].length - 1]}`;
      res.push(str);
      states.push({
        phase: "build",
        i,
        indicator,
        groups: snapGroups(),
        values: values.map((v) => [...v]),
        res: [...res],
        log: { kind: "build-range", index: i, str, group: [...values[i]] },
      });
    }
  }

  states.push({
    phase: "done",
    i: values.length,
    indicator,
    groups: snapGroups(),
    values: values.map((v) => [...v]),
    res: [...res],
    log: { kind: "done", result: [...res] },
  });

  return { states, answer: res };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "start-group":
      return (
        <span className="ok">
          i=0: start group {event.indicator} with [{event.curr}].
        </span>
      );
    case "extend":
      return (
        <span className="ok">
          {event.curr} = {event.prev}+1 → extend group {event.indicator}: push {event.curr}.
        </span>
      );
    case "new-group":
      return (
        <span className="cut">
          {event.curr} ≠ {event.prev}+1 → new group {event.indicator}: [{event.curr}].
        </span>
      );
    case "build-range":
      return (
        <span className="hit">
          Group {event.index + 1} [{event.group.join(",")}] → "{event.str}".
        </span>
      );
    case "build-single":
      return (
        <span className="hit">
          Group {event.index + 1} [{event.value}] → "{event.str}".
        </span>
      );
    case "done":
      return (
        <span className="done">
          Done. Result: [{event.result.map((s) => `"${s}"`).join(", ")}].
        </span>
      );
  }
}

function SummaryView({
  nums,
  groups,
  i,
  phase,
  res,
}: {
  nums: number[];
  groups: [number, number[]][];
  i: number;
  phase: "group" | "build" | "done";
  res: string[];
}) {
  // Build value → group-indicator lookup for coloring cells
  const valueToGroup = new Map<number, number>();
  for (const [gid, vals] of groups) {
    for (const v of vals) {
      valueToGroup.set(v, gid);
    }
  }

  return (
    <div style={{ margin: "20px 0" }}>
      <div style={{ color: "#8a8f98", fontSize: 12, marginBottom: 8 }}>
        Input nums (colored by group):
      </div>
      <div className="array" style={{ marginTop: 0 }}>
        {nums.map((v, k) => {
          const gid = valueToGroup.get(v);
          const col = gid !== undefined ? groupColor(gid) : "#2a2e3a";
          const isCurrent = phase === "group" && k === i;
          return (
            <div
              key={k}
              className="cell"
              style={{
                border: `2px solid ${isCurrent ? "#f59e0b" : col}`,
                background: isCurrent
                  ? "#3b301a"
                  : gid !== undefined
                    ? `${col}22`
                    : "#1c1f29",
                color: isCurrent ? "#f59e0b" : gid !== undefined ? col : "#5a5f6a",
              }}
            >
              <span className="idx">{k}</span>
              {v}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, color: "#8a8f98", fontSize: 12, marginBottom: 8 }}>
        Groups (map):
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {groups.map(([gid, vals]) => (
          <div
            key={gid}
            style={{
              background: "#1c1f29",
              border: `2px solid ${groupColor(gid)}`,
              borderRadius: 6,
              padding: "5px 12px",
              fontSize: 13,
              color: groupColor(gid),
              fontWeight: 600,
              fontFamily: "monospace",
            }}
          >
            {gid}: [{vals.join(",")}]
          </div>
        ))}
      </div>

      {(phase === "build" || phase === "done") && (
        <div style={{ marginTop: 16 }}>
          <div style={{ color: "#8a8f98", fontSize: 12, marginBottom: 8 }}>Result strings:</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {res.map((s, k) => (
              <div
                key={k}
                style={{
                  background: "#1e3a5f",
                  border: "2px solid #3b82f6",
                  borderRadius: 6,
                  padding: "4px 12px",
                  fontSize: 13,
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
              >
                "{s}"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const NUMS = [0, 1, 2, 4, 5, 7];

export function SummaryRangesViz() {
  const { states, answer } = useMemo(() => buildStates(NUMS), []);
  const expected = useMemo(() => summaryRanges([...NUMS]), []);
  const ok = JSON.stringify(answer) === JSON.stringify(expected);

  return (
    <>
      <h1>summaryRanges([0,1,2,4,5,7])</h1>
      <p className="legend">
        Walk the array. If curr = prev+1 (consecutive), append to the current group. Otherwise start
        a new group (indicator++). Each group becomes a range string: "a→b" if multi-element, "a"
        if single. Numbers are colored by their group.
      </p>

      <StepPlayer
        states={states}
        render={(s) => (
          <>
            <SummaryView
              nums={NUMS}
              groups={s.groups}
              i={s.i}
              phase={s.phase}
              res={s.res}
            />
            <div className="log">
              <LogLine event={s.log} />
            </div>
          </>
        )}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${JSON.stringify(answer)}, and the real summaryRanges from src/ also gives ${JSON.stringify(expected)}.`
          : `✗ Mismatch: visualization says ${JSON.stringify(answer)}, but src/ returns ${JSON.stringify(expected)}.`}
      </p>
    </>
  );
}
