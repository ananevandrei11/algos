import { useMemo } from "react";
import { mergeIntervals } from "@algos/mergeIntervals/mergeIntervals";
import { StepPlayer } from "../components/StepPlayer";

// Frame generator + view for mergeIntervals.
// States are plain DATA — the view turns them into JSX.
// No HTML strings, no dangerouslySetInnerHTML.
// The real src/ function is imported only to verify the final answer.

type LogEvent =
  | { kind: "sorted" }
  | { kind: "init"; interval: number[] }
  | { kind: "overlap"; curr: number[]; newEnd: number }
  | { kind: "disjoint"; curr: number[] }
  | { kind: "done"; total: number };

interface State {
  sorted: number[][];
  res: number[][];
  count: number;
  i: number;
  log: LogEvent;
}

function buildStates(intervals: number[][]): { states: State[]; answer: number[][] } {
  const states: State[] = [];
  // Mirror src: const sorted = intervals.sort((a, b) => a[0] - b[0])
  // Deep copy first to avoid mutating the original input array.
  const sorted = intervals.map((a) => [...a]).sort((a, b) => a[0] - b[0]);

  states.push({
    sorted: sorted.map((a) => [...a]),
    res: [],
    count: 0,
    i: -1,
    log: { kind: "sorted" },
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
        log: { kind: "init", interval: [...sorted[i]] },
      });
      continue;
    }
    const start = sorted[i][0];
    // src/ also declares `const startRes = res[count][0]` here, but never uses it
    // in the condition — omitted to satisfy TypeScript's noUnusedLocals.
    const endRes = res[count][1];
    if (start <= endRes) {
      res[count][1] = Math.max(endRes, sorted[i][1]);
      states.push({
        sorted: sorted.map((a) => [...a]),
        res: res.map((a) => [...a]),
        count,
        i,
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
        log: { kind: "disjoint", curr: [...sorted[i]] },
      });
    }
  }

  states.push({
    sorted: sorted.map((a) => [...a]),
    res: res.map((a) => [...a]),
    count,
    i: sorted.length,
    log: { kind: "done", total: res.length },
  });

  return { states, answer: res };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "sorted":
      return <span className="ok">Sorted intervals by start value.</span>;
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
}: {
  sorted: number[][];
  res: number[][];
  i: number;
}) {
  const allVals = [...sorted, ...res].flat();
  const min = Math.min(...allVals);
  const max = Math.max(...allVals);
  const range = max - min || 1;
  const lp = (v: number) => `${((v - min) / range) * 92}%`;
  const wp = (s: number, e: number) => `${Math.max(((e - s) / range) * 92, 3)}%`;

  return (
    <div style={{ margin: "20px 0" }}>
      <div style={{ color: "#8a8f98", fontSize: 12, marginBottom: 6 }}>Sorted input:</div>
      <div
        style={{ position: "relative", height: `${sorted.length * 30 + 4}px`, marginBottom: 20 }}
      >
        {sorted.map(([s, e], k) => {
          const isCurrent = k === i;
          const isDone = k < i || i === sorted.length;
          const bg = isCurrent ? "#3b301a" : isDone ? "#1a2a1a" : "#1c1f29";
          const border = isCurrent ? "#f59e0b" : isDone ? "#10b981" : "#2a2e3a";
          const color = isCurrent ? "#f59e0b" : isDone ? "#10b981" : "#8a8f98";
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
              [{s},{e}]
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
  [2, 6],
  [8, 10],
  [15, 18],
];

export function MergeIntervalsViz() {
  const { states, answer } = useMemo(
    () => buildStates(INTERVALS.map((a) => [...a])),
    [],
  );
  const expected = useMemo(
    () => mergeIntervals(INTERVALS.map((a) => [...a])),
    [],
  );
  const ok = JSON.stringify(answer) === JSON.stringify(expected);

  return (
    <>
      <h1>mergeIntervals([[1,3],[2,6],[8,10],[15,18]])</h1>
      <p className="legend">
        Sort intervals by start, then walk left to right. If the next interval's start ≤ the last
        result end, they <b className="c-win">overlap</b> — extend the result end. Otherwise push a
        new result interval.{" "}
        <b style={{ color: "#f59e0b" }}>Yellow</b> = current,{" "}
        <b className="c-right">green</b> = processed,{" "}
        <b className="c-win">blue</b> = result.
      </p>

      <StepPlayer
        states={states}
        render={(s) => (
          <>
            <IntervalsView sorted={s.sorted} res={s.res} i={s.i} />
            <div className="log">
              <LogLine event={s.log} />
            </div>
          </>
        )}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${JSON.stringify(answer)}, and the real mergeIntervals from src/ also gives ${JSON.stringify(expected)}.`
          : `✗ Mismatch: visualization says ${JSON.stringify(answer)}, but src/ returns ${JSON.stringify(expected)}.`}
      </p>
    </>
  );
}
