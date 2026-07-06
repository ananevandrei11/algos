import { useMemo } from "react";
import { hammingWeight } from "@algos/hammingWeight/hammingWeight";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "init"; n: number }
  | {
      kind: "loop";
      iteration: number;
      carryBefore: number;
      num: number;
      carryAfter: number;
      binaryN: string;
      count: number;
      incremented: boolean;
    }
  | { kind: "done"; count: number; binaryN: string };

interface State {
  iteration: number;
  carryBefore: number | null;
  carry: number;
  num: number | null;
  binaryN: string;
  count: number;
  log: LogEvent;
}

function buildStates(n: number): { states: State[]; answer: number } {
  const states: State[] = [];
  let binaryN = "";
  let carry = n;
  let count = 0;

  states.push({
    iteration: 0,
    carryBefore: null,
    carry,
    num: null,
    binaryN,
    count,
    log: { kind: "init", n },
  });

  let iteration = 0;
  while (carry > 0) {
    const carryBefore = carry;
    const num = carry % 2;
    carry = Math.floor(carry / 2);
    binaryN = num.toString() + binaryN;
    const incremented = num === 1;
    if (num === 1) {
      count++;
    }
    iteration += 1;

    states.push({
      iteration,
      carryBefore,
      carry,
      num,
      binaryN,
      count,
      log: {
        kind: "loop",
        iteration,
        carryBefore,
        num,
        carryAfter: carry,
        binaryN,
        count,
        incremented,
      },
    });
  }

  states.push({
    iteration,
    carryBefore: null,
    carry,
    num: null,
    binaryN,
    count,
    log: { kind: "done", count, binaryN },
  });

  return { states, answer: count };
}

function toBitCells(binaryN: string): string[] {
  return binaryN.padStart(32, "0").slice(-32).split("");
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "init":
      return (
        <span>
          Initialize <code>binaryN=""</code>, <code>carry={event.n}</code>, and{" "}
          <code>count=0</code>.
        </span>
      );
    case "loop":
      return (
        <span>
          Loop {event.iteration}: <code>{event.carryBefore} % 2 = {event.num}</code>, then{" "}
          <code>carry = Math.floor({event.carryBefore} / 2) = {event.carryAfter}</code>.
          Prepend <code>{event.num}</code> to binaryN
          {event.incremented ? (
            <span className="ok"> and increment count to {event.count}.</span>
          ) : (
            <span>.</span>
          )}
        </span>
      );
    case "done":
      return (
        <span className="done">
          carry is 0, so the while loop stops. Return count = <code>{event.count}</code>.
        </span>
      );
  }
}

function HammingWeightView({ state }: { state: State }) {
  const bitCells = toBitCells(state.binaryN);
  const activeStart = 32 - state.binaryN.length;
  const prependedIndex =
    state.log.kind === "loop" && state.binaryN.length > 0 ? activeStart : -1;

  return (
    <>
      <div
        style={{
          overflowX: "auto",
          paddingTop: 18,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(32, minmax(20px, 1fr))",
            gap: 4,
            minWidth: 760,
          }}
        >
          {bitCells.map((bit, idx) => {
            const isBuilt = idx >= activeStart;
            const isPrepended = idx === prependedIndex;
            return (
              <div
                key={idx}
                style={{
                  height: 34,
                  borderRadius: 6,
                  border: `1px solid ${isPrepended ? "#f59e0b" : "#2a2e3a"}`,
                  background: isBuilt ? "#1c1f29" : "#11131a",
                  color: bit === "1" && isBuilt ? "#10b981" : "#8a8f98",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 14,
                  fontWeight: isBuilt ? 700 : 400,
                  boxShadow: isPrepended ? "0 0 0 2px #f59e0b inset" : undefined,
                }}
                title={`bit ${idx}`}
              >
                {bit}
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats">
        <div className="stat target">
          carry<b>{state.carry}</b>
        </div>
        <div className="stat sum">
          count<b>{state.count}</b>
        </div>
        <div className="stat best">
          binaryN<b>{state.binaryN || '""'}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const N = 11;

export function HammingWeightViz() {
  const { states, answer } = useMemo(() => buildStates(N), []);
  const expected = useMemo(() => hammingWeight(N), []);
  const ok = answer === expected;

  return (
    <>
      <h1>hammingWeight({N})</h1>
      <p className="legend">
        Repeatedly take <b className="c-left">carry % 2</b>, divide carry by 2,
        prepend that digit to <code>binaryN</code>, and increment <code>count</code>{" "}
        only when the digit is 1. The row shows the built binary digits padded into
        32 bit cells.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <HammingWeightView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
