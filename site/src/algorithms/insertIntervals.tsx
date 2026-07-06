import { useMemo } from "react";
import { insertIntervals } from "@algos/insertIntervals/insertIntervals";
import { StepPlayer } from "../components/StepPlayer";

// Frame generator + view for insertIntervals.
// States are plain DATA — the view turns them into JSX.
// No HTML strings, no dangerouslySetInnerHTML.
// The real src/ function is imported only to verify the final answer.

type LogEvent =
  | { kind: "sorted"; newAt: number }
  | { kind: "init"; interval: number[] }
  | { kind: "overlap"; curr: number[]; newEnd: number }
  | { kind: "disjoint"; curr: number[] }
  | { kind: "done"; total: number };

interface State {
  sorted: number[][];
  res: number[][];
  count: number;
  i: number;
  newAt: number; // index of newInterval in sorted
  log: LogEvent;
}

function buildStates(
  intervals: number[][],
  newInterval: number[],
): { states: State[]; answer: number[][] } {
  const states: State[] = [];
  // Mirror src: const sorted = [...intervals, newInterval].sort((a,b) => a[0] - b[0])
  const combined = [...intervals.map((a) => [...a]), [...newInterval]];
  const sorted = combined.sort((a, b) => a[0] - b[0]);

  // Identify where newInterval landed in sorted by matching values
  const newAt = sorted.findIndex(([s, e]) => s === newInterval[0] && e === newInterval[1]);

  states.push({
    sorted: sorted.map((a) => [...a]),
    res: [],
    count: 0,
    i: -1,
    newAt,
    log: { kind: "sorted", newAt },
  });

  let res: number[][] = [];
  let count = 0;

  for (let i = 0; i < sorted.length; i += 1) {
    if (i === 0) {
      res.push([...sorted[i]]);
      states.push({
        sorted: sorted.map((a) => [...a]),
        res: res.map((a) => [...a]),
        count,
        i,
        newAt,
        log: { kind: "init", interval: [...sorted[i]] },
      });
      continue;
    }
    const start = sorted[i][0];
    const endRes = res[count][1];
    if (start <= endRes) {
      res[count][1] = Math.max(endRes, sorted[i][1]);
      states.push({
        sorted: sorted.map((a) => [...a]),
        res: res.map((a) => [...a]),
        count,
        i,
        newAt,
        log: { kind: "overlap", curr: [...sorted[i]], newEnd: res[count][1] },
      });
    } else {
      count++;
      res.push([...sorted[i]]);
      states.push({
        sorted: sorted.map((a) => [...a]),
        res: res.map((a) => [...a]),
        count,
        i,
        newAt,
        log: { kind: "disjoint", curr: [...sorted[i]] },
      });
    }
  }

  states.push({
    sorted: sorted.map((a) => [...a]),
    res: res.map((a) => [...a]),
    count,
    i: sorted.length,
    newAt,
    log: { kind: "done", total: res.length },
  });

  return { states, answer: res };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "sorted":
      return (
        <span className="ok">
          newInterval inserted and all sorted by start. New interval is at position {event.newAt}.
        </span>
      );
    case "init":
      return (
        <span className="ok">
          i=0: push [{event.interval[0]},{event.interval[1]}] as the first result interval.
        </span>
      );
    case "overlap":
      return (
        <>
          <span className="hit">
            Overlap! [{event.curr[0]},{event.curr[1]}] starts ≤ last result end.
          </span>{" "}
          Extend result end to {event.newEnd}.
        </>
      );
    case "disjoint":
      return (
        <span className="cut">
          No overlap. Push [{event.curr[0]},{event.curr[1]}] as a new result interval.
        </span>
      );
    case "done":
      return (
        <span className="done">
          Done. {event.total} interval{event.total !== 1 ? "s" : ""} in result.
        </span>
      );
  }
}

function IntervalsView({
  sorted,
  res,
  i,
  newAt,
}: {
  sorted: number[][];
  res: number[][];
  i: number;
  newAt: number;
}) {
  const allVals = [...sorted, ...res].flat();
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const range = max - min || 1;
  const lp = (v: number) => `${((v - min) / range) * 92}%`;
  const wp = (s: number, e: number) => `${Math.max(((e - s) / range) * 92, 3)}%`;

  return (
    <div style={{ margin: "20px 0" }}>
      <div style={{ color: "#8a8f98", fontSize: 12, marginBottom: 6 }}>
        Sorted (intervals + newInterval):
      </div>
      <div
        style={{
          position: "relative",
          height: `${sorted.length * 30 + 4}px`,
          marginBottom: 20,
        }}
      >
        {sorted.map(([s, e], k) => {
          const isCurrent = k === i;
          const isDone = k < i || i === sorted.length;
          const isNew = k === newAt;
          const bg = isCurrent
            ? "#3b301a"
            : isNew
              ? "#1a1a3a"
              : isDone
                ? "#1a2a1a"
                : "#1c1f29";
          const border = isCurrent
            ? "#f59e0b"
            : isNew
              ? "#a78bfa"
              : isDone
                ? "#10b981"
                : "#2a2e3a";
          const color = isCurrent
            ? "#f59e0b"
            : isNew
              ? "#a78bfa"
              : isDone
                ? "#10b981"
                : "#8a8f98";
          return (
            <div
              key={k}
              style={{
                position: "absolute",
                left: lp(s),
                width: wp(s, e),
                top: `${k * 30}px`,
                height: 22,
                background: bg,
                border: `2px solid ${border}`,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 600,
                color,
              }}
            >
              {isNew ? "★ " : ""}[{s},{e}]
            </div>
          );
        })}
      </div>

      <div style={{ color: "#8a8f98", fontSize: 12, marginBottom: 6 }}>Result so far:</div>
      <div style={{ position: "relative", height: `${Math.max(res.length, 1) * 30 + 4}px` }}>
        {res.map(([s, e], k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: lp(s),
              width: wp(s, e),
              top: `${k * 30}px`,
              height: 22,
              background: "#1e3a5f",
              border: "2px solid #3b82f6",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 600,
              color: "#3b82f6",
            }}
          >
            [{s},{e}]
          </div>
        ))}
      </div>
    </div>
  );
}

const INTERVALS = [
  [1, 3],
  [6, 9],
];
const NEW_INTERVAL = [2, 5];

export function InsertIntervalsViz() {
  const { states, answer } = useMemo(
    () => buildStates(INTERVALS.map((a) => [...a]), [...NEW_INTERVAL]),
    [],
  );
  const expected = useMemo(
    () => insertIntervals(INTERVALS.map((a) => [...a]), [...NEW_INTERVAL]),
    [],
  );
  const ok = JSON.stringify(answer) === JSON.stringify(expected);

  return (
    <>
      <h1>insertIntervals([[1,3],[6,9]], newInterval=[2,5])</h1>
      <p className="legend">
        Prepend the new interval, sort by start, then merge overlaps exactly like mergeIntervals.{" "}
        <b style={{ color: "#a78bfa" }}>Purple (★)</b> = inserted interval,{" "}
        <b style={{ color: "#f59e0b" }}>yellow</b> = current,{" "}
        <b className="c-right">green</b> = processed,{" "}
        <b className="c-win">blue</b> = result.
      </p>

      <StepPlayer
        states={states}
        render={(s) => (
          <>
            <IntervalsView sorted={s.sorted} res={s.res} i={s.i} newAt={s.newAt} />
            <div className="log">
              <LogLine event={s.log} />
            </div>
          </>
        )}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${JSON.stringify(answer)}, and the real insertIntervals from src/ also gives ${JSON.stringify(expected)}.`
          : `✗ Mismatch: visualization says ${JSON.stringify(answer)}, but src/ returns ${JSON.stringify(expected)}.`}
      </p>
    </>
  );
}
