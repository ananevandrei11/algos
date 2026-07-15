import { useMemo } from "react";
import { romanToInt } from "@algos/romanToInt/romanToInt";
import { StepPlayer } from "../components/StepPlayer";

const mapRoman: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

type LogEvent = {
  kind: "add" | "subtract";
  i: number;
  ch: string;
  current: number;
  next: number;
  res: number;
};

interface State {
  s: string;
  i: number;
  ch: string;
  current: number;
  next: number;
  res: number;
  log: LogEvent;
}

function buildStates(s: string): { states: State[]; answer: number } {
  const states: State[] = [];
  let res = 0;

  for (let i = 0; i < s.length; i++) {
    const current = mapRoman[s[i]];
    const next = mapRoman[s[i + 1]] || 0;

    if (current >= next) {
      res += current;
    } else {
      res -= current;
    }

    states.push({
      s,
      i,
      ch: s[i],
      current,
      next,
      res,
      log: { kind: current >= next ? "add" : "subtract", i, ch: s[i], current, next, res },
    });
  }

  return { states, answer: res };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "add") {
    return (
      <span className="ok">
        '{event.ch}' = <code>{event.current}</code>, next symbol value ={" "}
        <code>{event.next}</code>. <code>{event.current} &ge; {event.next}</code> →{" "}
        add: <code>res += {event.current}</code> = <code>{event.res}</code>.
      </span>
    );
  }
  return (
    <span className="fail">
      '{event.ch}' = <code>{event.current}</code>, next symbol value ={" "}
      <code>{event.next}</code>. <code>{event.current} &lt; {event.next}</code> →{" "}
      subtract: <code>res -= {event.current}</code> = <code>{event.res}</code>.
    </span>
  );
}

function RomanToIntView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.s.split("").map((ch, idx) => {
          const cls = ["cell"];
          if (idx === state.i) cls.push("active");
          else if (idx < state.i) cls.push("visited");
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {ch}
            </div>
          );
        })}
      </div>

      <div className="stats">
        <div className="stat target">
          current<b>{state.current}</b>
        </div>
        <div className="stat sum">
          next<b>{state.next}</b>
        </div>
        <div className="stat best">
          res<b>{state.res}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const S = "MCMXCIV";

export function RomanToIntViz() {
  const { states, answer } = useMemo(() => buildStates(S), []);
  const expected = useMemo(() => romanToInt(S), []);
  const ok = answer === expected;

  return (
    <>
      <h1>romanToInt("{S}")</h1>
      <p className="legend">
        Scan left to right. Look up the current symbol's value and the next symbol's
        value (0 if there is none). If the current value is at least the next value, add
        it to the result; otherwise subtract it (the classic subtractive-notation cases
        like <code>IV</code>, <code>CM</code>).
      </p>

      <StepPlayer states={states} render={(s) => <RomanToIntView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
