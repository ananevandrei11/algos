import { useMemo } from "react";
import { mySqrt } from "@algos/mySqrt/mySqrt";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "init"; q: number; square: number }
  | {
      kind: "iterate";
      iteration: number;
      q: number;
      square: number;
      quotient: number;
      average: number;
      nextQ: number;
    }
  | { kind: "done"; q: number; square: number };

interface State {
  x: number;
  iteration: number;
  q: number;
  square: number;
  quotient: number | null;
  average: number | null;
  nextQ: number | null;
  log: LogEvent;
}

function buildStates(x: number): { states: State[]; answer: number } {
  const states: State[] = [];
  let q = x;
  let iteration = 0;

  states.push({
    x,
    iteration,
    q,
    square: q * q,
    quotient: null,
    average: null,
    nextQ: null,
    log: { kind: "init", q, square: q * q },
  });

  while (q * q > x) {
    const square = q * q;
    const quotient = x / q;
    const average = (q + quotient) / 2;
    const nextQ = Math.floor(average);

    states.push({
      x,
      iteration,
      q,
      square,
      quotient,
      average,
      nextQ,
      log: { kind: "iterate", iteration, q, square, quotient, average, nextQ },
    });

    q = nextQ;
    iteration += 1;
  }

  states.push({
    x,
    iteration,
    q,
    square: q * q,
    quotient: null,
    average: null,
    nextQ: null,
    log: { kind: "done", q, square: q * q },
  });

  return { states, answer: q };
}

function formatFloat(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(3);
}

function LogLine({ event, x }: { event: LogEvent; x: number }) {
  if (event.kind === "init") {
    return (
      <span>
        Initialize <code>q = x = {x}</code>. Check whether <code>q*q</code> is still
        greater than <code>x</code>.
      </span>
    );
  }
  if (event.kind === "iterate") {
    return (
      <span>
        Iteration {event.iteration + 1}: <code>{event.q}*{event.q} = {event.square}</code>{" "}
        &gt; <code>{x}</code>, so update{" "}
        <code>q = floor((q + x / q) / 2)</code> ={" "}
        <code>floor(({event.q} + {formatFloat(event.quotient)}) / 2)</code> ={" "}
        <code>{event.nextQ}</code>.
      </span>
    );
  }
  return (
    <span className="done">
      Stop: <code>{event.q}*{event.q} = {event.square}</code> is not greater than{" "}
      <code>{x}</code>. Return <code>{event.q}</code>.
    </span>
  );
}

function MySqrtView({ state }: { state: State }) {
  const isIterate = state.log.kind === "iterate";

  return (
    <>
      <div className="stats">
        <div className="stat target">
          x<b>{state.x}</b>
        </div>
        <div className="stat sum">
          q<b>{state.q}</b>
        </div>
        <div className="stat best">
          q*q<b>{state.square}</b>
        </div>
      </div>

      <div
        style={{
          background: "#161922",
          border: "1px solid #2a2e3a",
          borderRadius: 8,
          padding: "16px 18px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        <div>
          <span className="hint">loop condition:</span> <code>{state.q} * {state.q} &gt; {state.x}</code>{" "}
          <span className={state.square > state.x ? "cut" : "ok"}>
            {state.square > state.x ? "true" : "false"}
          </span>
        </div>
        {isIterate && (
          <>
            <div>
              <span className="hint">x / q:</span> <code>{state.x} / {state.q} = {formatFloat(state.quotient!)}</code>
            </div>
            <div>
              <span className="hint">average:</span>{" "}
              <code>({state.q} + {formatFloat(state.quotient!)}) / 2 = {formatFloat(state.average!)}</code>
            </div>
            <div>
              <span className="hint">next q:</span> <code>floor({formatFloat(state.average!)}) = {state.nextQ}</code>
            </div>
          </>
        )}
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} x={state.x} />
      </div>
    </>
  );
}

const X = 8;

export function MySqrtViz() {
  const { states, answer } = useMemo(() => buildStates(X), []);
  const expected = useMemo(() => mySqrt(X), []);
  const ok = answer === expected;

  return (
    <>
      <h1>mySqrt({X})</h1>
      <p className="legend">
        Start with <code>q = x</code>. While <code>q*q &gt; x</code>, apply the exact
        integer update from <code>src/</code>:{" "}
        <code>q = Math.floor((q + x / q) / 2)</code>. The first <code>q</code> whose
        square is not greater than <code>x</code> is returned.
      </p>

      <StepPlayer states={states} render={(s) => <MySqrtView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
