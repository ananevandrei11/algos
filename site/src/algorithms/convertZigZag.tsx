import { useMemo } from "react";
import { convertZigZag } from "@algos/convertZigZag/convertZigZag";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "single-row" }
  | { kind: "append"; index: number; char: string; rowBefore: number; flipped: boolean; step: number; rowAfter: number }
  | { kind: "done"; result: string };

interface State {
  s: string;
  numRows: number;
  index: number;
  char: string;
  row: number;
  step: number;
  rows: string[];
  log: LogEvent;
}

function buildStates(s: string, numRows: number): { states: State[]; answer: string } {
  const states: State[] = [];

  if (numRows === 1) {
    states.push({ s, numRows, index: -1, char: "", row: 0, step: -1, rows: [s], log: { kind: "single-row" } });
    return { states, answer: s };
  }

  const rows: string[] = new Array(numRows).fill("");
  let row = 0;
  let step = -1;
  let index = 0;

  for (const c of s) {
    rows[row] += c;
    const rowBefore = row;
    let flipped = false;
    if (row === 0 || row === numRows - 1) {
      step = -step;
      flipped = true;
    }
    row += step;

    states.push({
      s,
      numRows,
      index,
      char: c,
      row,
      step,
      rows: [...rows],
      log: { kind: "append", index, char: c, rowBefore, flipped, step, rowAfter: row },
    });

    index += 1;
  }

  const result = rows.join("");
  states.push({ s, numRows, index, char: "", row, step, rows: [...rows], log: { kind: "done", result } });
  return { states, answer: result };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "single-row") {
    return <span className="done">numRows is 1 → return the string unchanged.</span>;
  }
  if (event.kind === "append") {
    return (
      <span>
        append '{event.char}' to row {event.rowBefore}.{" "}
        {event.flipped ? (
          <span className="ok">at an edge row → flip direction, </span>
        ) : (
          ""
        )}
        next row = <code>{event.rowAfter}</code> (step <code>{event.step}</code>).
      </span>
    );
  }
  return (
    <span className="done">
      every character placed. Join the rows: <code>"{event.result}"</code>
    </span>
  );
}

function ConvertZigZagView({ state }: { state: State }) {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {state.rows.map((rowStr, ri) => (
          <div className="array" key={ri} style={{ margin: 0, alignItems: "center" }}>
            <span className="hint" style={{ width: 20 }}>
              {ri}
            </span>
            {rowStr.split("").map((ch, ci) => {
              const isLast = ri === state.row && ci === rowStr.length - 1 && ch === state.char;
              const cls = ["cell"];
              if (isLast) cls.push("active");
              return (
                <div className={cls.join(" ")} key={ci} style={{ width: 36, height: 36, fontSize: 15 }}>
                  {ch}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="stats" style={{ marginTop: 16 }}>
        <div className="stat target">
          row<b>{state.row}</b>
        </div>
        <div className="stat sum">
          step<b>{state.step}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const S = "PAYPALISHIRING";
const NUM_ROWS = 3;

export function ConvertZigZagViz() {
  const { states, answer } = useMemo(() => buildStates(S, NUM_ROWS), []);
  const expected = useMemo(() => convertZigZag(S, NUM_ROWS), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        convertZigZag("{S}", {NUM_ROWS})
      </h1>
      <p className="legend">
        Walk the string one character at a time, appending it to the current row. The
        current row bounces between <code>0</code> and <code>numRows - 1</code>: hitting
        either edge flips the step direction, and the row index moves by that step after
        each append. Joining the rows in order gives the zig-zag reading.
      </p>

      <StepPlayer states={states} render={(s) => <ConvertZigZagView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns "${answer}", src/ also returns "${expected}".`
          : `✗ Mismatch: visualization says "${answer}", but src/ returns "${expected}".`}
      </p>
    </>
  );
}
