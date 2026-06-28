import { useMemo } from "react";
import { canCompleteCircuit } from "@algos/canCompleteCircuit/canCompleteCircuit";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "check"; totalGas: number; totalCost: number; impossible: boolean }
  | { kind: "step"; start: number; i: number; net: number; tank: number }
  | { kind: "fail"; start: number; i: number; net: number; tank: number }
  | { kind: "found"; start: number }
  | { kind: "done"; answer: number };

interface State {
  net: number[];
  start: number;
  i: number;
  tank: number;
  log: LogEvent;
}

function buildStates(
  gas: number[],
  cost: number[],
): { states: State[]; answer: number } {
  const states: State[] = [];
  const net = gas.map((g, idx) => g - cost[idx]);
  const n = gas.length;
  const totalGas = gas.reduce((s, v) => s + v, 0);
  const totalCost = cost.reduce((s, v) => s + v, 0);

  if (totalGas < totalCost) {
    states.push({
      net, start: -1, i: -1, tank: 0,
      log: { kind: "check", totalGas, totalCost, impossible: true },
    });
    states.push({
      net, start: -1, i: -1, tank: 0,
      log: { kind: "done", answer: -1 },
    });
    return { states, answer: -1 };
  }

  states.push({
    net, start: -1, i: -1, tank: 0,
    log: { kind: "check", totalGas, totalCost, impossible: false },
  });

  let answer = -1;
  outer: for (let start = 0; start < n; start += 1) {
    let tank = 0;
    let ok = true;
    for (let k = 0; k < n; k += 1) {
      const i = (start + k) % n;
      tank += gas[i] - cost[i];
      if (tank < 0) {
        ok = false;
        states.push({
          net, start, i, tank,
          log: { kind: "fail", start, i, net: net[i], tank },
        });
        break;
      }
      states.push({
        net, start, i, tank,
        log: { kind: "step", start, i, net: net[i], tank },
      });
    }
    if (ok) {
      answer = start;
      states.push({
        net, start, i: -1, tank,
        log: { kind: "found", start },
      });
      break outer;
    }
  }

  states.push({
    net, start: -1, i: -1, tank: 0,
    log: { kind: "done", answer },
  });
  return { states, answer };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "check") {
    return event.impossible ? (
      <span className="cut">
        Total gas={event.totalGas} &lt; total cost={event.totalCost} — impossible, return -1.
      </span>
    ) : (
      <span>
        Total gas={event.totalGas} ≥ total cost={event.totalCost} — try each start.
      </span>
    );
  }
  if (event.kind === "step") {
    const netStr = event.net >= 0 ? `+${event.net}` : `${event.net}`;
    return (
      <span className="ok">
        Station {event.i}: net={netStr} → tank={event.tank}. OK.
      </span>
    );
  }
  if (event.kind === "fail") {
    const netStr = event.net >= 0 ? `+${event.net}` : `${event.net}`;
    return (
      <span className="cut">
        Station {event.i}: net={netStr} → tank={event.tank} &lt; 0 — abandon start={event.start}.
      </span>
    );
  }
  if (event.kind === "found") {
    return (
      <span className="ok">
        Completed full circuit from start={event.start} ✓
      </span>
    );
  }
  return (
    <span className="done">
      Done. Starting station = <code>{event.answer}</code>.
    </span>
  );
}

function CanCompleteCircuitView({ state }: { state: State }) {
  const isFail = state.log.kind === "fail";
  const isDone = state.log.kind === "done";

  return (
    <>
      <div className="array">
        {state.net.map((val, idx) => {
          const isStart = state.start !== -1 && idx === state.start;
          const isI = state.i !== -1 && idx === state.i;
          const cls = ["cell"];
          if (isStart && !isI) cls.push("right-edge");
          if (isI && !isFail) cls.push("left-edge");
          return (
            <div
              key={idx}
              className={cls.join(" ")}
              style={
                isI && isFail
                  ? { borderColor: "#ef4444", boxShadow: "0 0 0 2px #ef4444 inset" }
                  : isStart && isI
                  ? { borderColor: "#f59e0b", boxShadow: "0 0 0 2px #f59e0b inset" }
                  : undefined
              }
            >
              <span className="idx">{idx}</span>
              {val >= 0 ? `+${val}` : val}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.net.map((_, idx) => {
          const isStart = state.start !== -1 && idx === state.start;
          const isI = state.i !== -1 && idx === state.i;
          return (
            <div className="ptr" key={idx}>
              {isStart && <span className="r">S</span>}
              {isStart && isI && " "}
              {isI && <span className="l">i</span>}
            </div>
          );
        })}
      </div>

      <div className="stats">
        <div className="stat sum">
          tank<b>{isDone || state.log.kind === "check" ? "—" : state.tank}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const GAS = [1, 2, 3, 4, 5];
const COST = [3, 4, 5, 1, 2];

export function CanCompleteCircuitViz() {
  const { states, answer } = useMemo(() => buildStates(GAS, COST), []);
  const expected = useMemo(() => canCompleteCircuit([...GAS], [...COST]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        canCompleteCircuit(gas=[{GAS.join(",")}], cost=[{COST.join(",")}])
      </h1>
      <p className="legend">
        Each cell shows <b>net[i] = gas[i] − cost[i]</b>.{" "}
        <b className="c-right">S</b> marks the current start candidate,{" "}
        <b className="c-left">i</b> is the station being visited. Try each start
        in order; simulate the full lap accumulating <b>tank</b>. The first start
        that completes the circuit without tank going negative is the answer.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <CanCompleteCircuitView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
