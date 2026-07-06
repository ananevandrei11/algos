import { useMemo } from "react";
import { spiralOrder } from "@algos/spiralOrder/spiralOrder";
import { StepPlayer } from "../components/StepPlayer";

type Direction = "right" | "down" | "left" | "up";

type LogEvent =
  | { kind: "push"; row: number; col: number; value: number; dir: Direction }
  | { kind: "done"; result: number[] };

interface State {
  top: number;
  bottom: number;
  left: number;
  right: number;
  activeRow: number;
  activeCol: number;
  visited: [number, number][];
  result: number[];
  log: LogEvent;
}

const MATRIX = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

function buildStates(matrix: number[][]): { states: State[]; answer: number[] } {
  const states: State[] = [];
  const visited: [number, number][] = [];

  // mirrors src/spiralOrder/spiralOrder.ts exactly
  // (single-row early return not triggered by this example)
  const res: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let col = left; col <= right; col++) {
      res.push(matrix[top][col]);
      visited.push([top, col]);
      states.push({
        top, bottom, left, right,
        activeRow: top, activeCol: col,
        visited: [...visited],
        result: [...res],
        log: { kind: "push", row: top, col, value: matrix[top][col], dir: "right" },
      });
    }
    top++;

    for (let row = top; row <= bottom; row++) {
      res.push(matrix[row][right]);
      visited.push([row, right]);
      states.push({
        top, bottom, left, right,
        activeRow: row, activeCol: right,
        visited: [...visited],
        result: [...res],
        log: { kind: "push", row, col: right, value: matrix[row][right], dir: "down" },
      });
    }
    right--;

    if (top <= bottom) {
      for (let col = right; col >= left; col--) {
        res.push(matrix[bottom][col]);
        visited.push([bottom, col]);
        states.push({
          top, bottom, left, right,
          activeRow: bottom, activeCol: col,
          visited: [...visited],
          result: [...res],
          log: { kind: "push", row: bottom, col, value: matrix[bottom][col], dir: "left" },
        });
      }
      bottom--;
    }

    if (left <= right) {
      for (let row = bottom; row >= top; row--) {
        res.push(matrix[row][left]);
        visited.push([row, left]);
        states.push({
          top, bottom, left, right,
          activeRow: row, activeCol: left,
          visited: [...visited],
          result: [...res],
          log: { kind: "push", row, col: left, value: matrix[row][left], dir: "up" },
        });
      }
      left++;
    }
  }

  states.push({
    top, bottom, left, right,
    activeRow: -1, activeCol: -1,
    visited: [...visited],
    result: [...res],
    log: { kind: "done", result: [...res] },
  });

  return { states, answer: res };
}

const DIR_LABEL: Record<Direction, string> = {
  right: "→ right",
  down: "↓ down",
  left: "← left",
  up: "↑ up",
};

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "push":
      return (
        <span className="ok">
          {DIR_LABEL[event.dir]}: matrix[{event.row}][{event.col}] = {event.value} → pushed to result
        </span>
      );
    case "done":
      return <span className="done">Done. Result: [{event.result.join(", ")}]</span>;
  }
}

function SpiralOrderView({
  matrix,
  state,
}: {
  matrix: number[][];
  state: State;
}) {
  const cols = matrix[0].length;

  return (
    <>
      <div
        className="matrix-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 56px)` }}
      >
        {matrix.map((row, r) =>
          row.map((val, c) => {
            const isActive = r === state.activeRow && c === state.activeCol;
            const isVisited =
              !isActive &&
              state.visited.some(([vr, vc]) => vr === r && vc === c);
            const inBoundary =
              !isVisited &&
              !isActive &&
              r >= state.top &&
              r <= state.bottom &&
              c >= state.left &&
              c <= state.right;
            const cls = ["cell"];
            if (isActive) cls.push("active");
            else if (isVisited) cls.push("visited");
            else if (inBoundary) cls.push("in-window");
            return (
              <div className={cls.join(" ")} key={`${r}-${c}`}>
                {val}
              </div>
            );
          })
        )}
      </div>

      <div className="array" style={{ marginTop: 20 }}>
        {state.result.map((v, i) => (
          <div
            className={`cell ${i === state.result.length - 1 ? "right-edge" : "in-window"}`}
            key={i}
          >
            <span className="idx">{i}</span>
            {v}
          </div>
        ))}
      </div>

      <div className="stats">
        <div className="stat">
          top<b style={{ color: "#f59e0b" }}>{state.top}</b>
        </div>
        <div className="stat">
          bottom<b style={{ color: "#f59e0b" }}>{state.bottom}</b>
        </div>
        <div className="stat">
          left<b style={{ color: "#10b981" }}>{state.left}</b>
        </div>
        <div className="stat">
          right<b style={{ color: "#10b981" }}>{state.right}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

export function SpiralOrderViz() {
  const { states, answer } = useMemo(() => buildStates(MATRIX), []);
  const expected = useMemo(() => spiralOrder(MATRIX), []);
  const ok = JSON.stringify(answer) === JSON.stringify(expected);

  return (
    <>
      <h1>spiralOrder([[1,2,3],[4,5,6],[7,8,9]])</h1>
      <p className="legend">
        Four boundaries shrink inward: <b style={{ color: "#f59e0b" }}>top/bottom</b> rows
        and <b style={{ color: "#10b981" }}>left/right</b> columns. Each iteration traverses
        the boundary clockwise: right along <b>top</b>, down along <b>right</b>, left along
        <b> bottom</b>, up along <b>left</b>. Then the boundary shrinks by one. The{" "}
        <b style={{ color: "#f59e0b" }}>amber cell</b> is the one being pushed;{" "}
        <b style={{ color: "#3b82f6" }}>blue cells</b> are inside the current boundary;
        dimmed cells are already collected.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <SpiralOrderView matrix={MATRIX} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: the visualization gives [${answer.join(", ")}], and the real spiralOrder from src/ also gives [${expected.join(", ")}].`
          : `✗ Mismatch: the visualization says [${answer.join(", ")}], but src/ returns [${expected.join(", ")}].`}
      </p>
    </>
  );
}
