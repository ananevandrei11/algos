import { useMemo } from "react";
import { intToRomanMedium } from "@algos/intToRomanMedium/intToRomanMedium";
import { StepPlayer } from "../components/StepPlayer";

const romanMap = [
  { value: 1000, numeral: "M" },
  { value: 900, numeral: "CM" },
  { value: 500, numeral: "D" },
  { value: 400, numeral: "CD" },
  { value: 100, numeral: "C" },
  { value: 90, numeral: "XC" },
  { value: 50, numeral: "L" },
  { value: 40, numeral: "XL" },
  { value: 10, numeral: "X" },
  { value: 9, numeral: "IX" },
  { value: 5, numeral: "V" },
  { value: 4, numeral: "IV" },
  { value: 1, numeral: "I" },
];

type LogEvent =
  | { kind: "check"; value: number; numeral: string; num: number; willAppend: boolean }
  | { kind: "append"; value: number; numeral: string; numBefore: number; numAfter: number; res: string }
  | { kind: "done"; res: string };

interface State {
  num: number;
  value: number;
  numeral: string;
  res: string;
  log: LogEvent;
}

function buildStates(num0: number): { states: State[]; answer: string } {
  const states: State[] = [];
  let res = "";
  let num = num0;

  for (const { value, numeral } of romanMap) {
    states.push({
      num,
      value,
      numeral,
      res,
      log: { kind: "check", value, numeral, num, willAppend: num >= value },
    });

    while (num >= value) {
      res += numeral;
      const numBefore = num;
      num -= value;
      states.push({
        num,
        value,
        numeral,
        res,
        log: { kind: "append", value, numeral, numBefore, numAfter: num, res },
      });
    }
  }

  states.push({ num, value: 0, numeral: "", res, log: { kind: "done", res } });
  return { states, answer: res };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "check") {
    return (
      <span className={event.willAppend ? "ok" : "hint"}>
        checking <code>{event.numeral}</code> (<code>{event.value}</code>):{" "}
        <code>{event.num} &ge; {event.value}</code>{" "}
        {event.willAppend ? "true → append" : "false → skip"}
      </span>
    );
  }
  if (event.kind === "append") {
    return (
      <span className="ok">
        append <code>{event.numeral}</code>, <code>num -= {event.value}</code>:{" "}
        <code>{event.numBefore} → {event.numAfter}</code>. result so far:{" "}
        <code>"{event.res}"</code>
      </span>
    );
  }
  return (
    <span className="done">
      every entry checked, <code>num</code> reached 0. Return <code>"{event.res}"</code>.
    </span>
  );
}

function IntToRomanMediumView({ state }: { state: State }) {
  return (
    <>
      <div className="stats">
        <div className="stat target">
          num<b>{state.num}</b>
        </div>
        <div className="stat sum">
          value<b>{state.value || "—"}</b>
        </div>
        <div className="stat best">
          numeral<b>{state.numeral || "—"}</b>
        </div>
      </div>

      <div
        style={{
          background: "#161922",
          border: "1px solid #2a2e3a",
          borderRadius: 8,
          padding: "16px 18px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 18,
        }}
      >
        "{state.res}"
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUM = 1994;

export function IntToRomanMediumViz() {
  const { states, answer } = useMemo(() => buildStates(NUM), []);
  const expected = useMemo(() => intToRomanMedium(NUM), []);
  const ok = answer === expected;

  return (
    <>
      <h1>intToRomanMedium({NUM})</h1>
      <p className="legend">
        Walk the value/numeral table from largest to smallest. For each entry, while{" "}
        <code>num</code> is at least that value, append the numeral and subtract the
        value — greedily consuming the largest symbols (including the subtractive forms
        like <code>CM</code>, <code>XC</code>) first.
      </p>

      <StepPlayer states={states} render={(s) => <IntToRomanMediumView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns "${answer}", src/ also returns "${expected}".`
          : `✗ Mismatch: visualization says "${answer}", but src/ returns "${expected}".`}
      </p>
    </>
  );
}
