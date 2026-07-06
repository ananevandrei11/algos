import { useMemo } from "react";
import { reverseBits } from "@algos/reverseBits/reverseBits";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "init"; n: number }
  | {
      kind: "build";
      iteration: number;
      carryBefore: number;
      num: number;
      carryAfter: number;
      binaryN: string;
    }
  | { kind: "pad"; lengthBefore: number; binaryN: string }
  | {
      kind: "sum";
      index: number;
      bit: number;
      add: number;
      res: number;
    }
  | { kind: "done"; res: number; binaryN: string };

interface State {
  phase: "build" | "pad" | "sum" | "done";
  iteration: number;
  carry: number;
  carryBefore: number | null;
  num: number | null;
  binaryN: string;
  index: number | null;
  bit: number | null;
  add: number | null;
  res: number;
  log: LogEvent;
}

function buildStates(n: number): { states: State[]; answer: number } {
  const states: State[] = [];
  let binaryN = "";
  let carry = n;

  states.push({
    phase: "build",
    iteration: 0,
    carry,
    carryBefore: null,
    num: null,
    binaryN,
    index: null,
    bit: null,
    add: null,
    res: 0,
    log: { kind: "init", n },
  });

  let iteration = 0;
  while (carry > 0) {
    const carryBefore = carry;
    const num = carry % 2;
    carry = Math.floor(carry / 2);
    binaryN = num.toString() + binaryN;
    iteration += 1;

    states.push({
      phase: "build",
      iteration,
      carry,
      carryBefore,
      num,
      binaryN,
      index: null,
      bit: null,
      add: null,
      res: 0,
      log: {
        kind: "build",
        iteration,
        carryBefore,
        num,
        carryAfter: carry,
        binaryN,
      },
    });
  }

  while (binaryN.length < 32) {
    const lengthBefore = binaryN.length;
    binaryN = "0" + binaryN;

    states.push({
      phase: "pad",
      iteration,
      carry,
      carryBefore: null,
      num: null,
      binaryN,
      index: null,
      bit: null,
      add: null,
      res: 0,
      log: { kind: "pad", lengthBefore, binaryN },
    });
  }

  let res = 0;
  for (let i = 0; i < binaryN.length; i++) {
    const bit = parseInt(binaryN[i]);
    const add = bit * Math.pow(2, i);
    res += add;

    states.push({
      phase: "sum",
      iteration,
      carry,
      carryBefore: null,
      num: null,
      binaryN,
      index: i,
      bit,
      add,
      res,
      log: { kind: "sum", index: i, bit, add, res },
    });
  }

  states.push({
    phase: "done",
    iteration,
    carry,
    carryBefore: null,
    num: null,
    binaryN,
    index: null,
    bit: null,
    add: null,
    res,
    log: { kind: "done", res, binaryN },
  });

  return { states, answer: res };
}

function toBitCells(binaryN: string): string[] {
  return binaryN.padStart(32, "0").slice(-32).split("");
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "init":
      return (
        <span>
          Initialize <code>binaryN=""</code> and <code>carry={event.n}</code>.
        </span>
      );
    case "build":
      return (
        <span>
          Build loop {event.iteration}: <code>{event.carryBefore} % 2 = {event.num}</code>,{" "}
          <code>carry = Math.floor({event.carryBefore} / 2) = {event.carryAfter}</code>,
          then prepend <code>{event.num}</code> to <code>binaryN</code>.
        </span>
      );
    case "pad":
      return (
        <span>
          Pad loop: length {event.lengthBefore} is below 32, so prepend{" "}
          <code>0</code>.
        </span>
      );
    case "sum":
      return (
        <span>
          Sum loop index {event.index}: <code>parseInt(binaryN[{event.index}]) = {event.bit}</code>,{" "}
          add <code>{event.bit} * 2^{event.index} = {event.add}</code>, so{" "}
          <code>res = {event.res}</code>.
        </span>
      );
    case "done":
      return (
        <span className="done">
          All 32 bits have been visited. Return <code>{event.res}</code>.
        </span>
      );
  }
}

function ReverseBitsView({ state }: { state: State }) {
  const bitCells = toBitCells(state.binaryN);
  const builtStart = 32 - state.binaryN.length;
  const prependedIndex =
    (state.log.kind === "build" || state.log.kind === "pad") && state.binaryN.length > 0
      ? builtStart
      : -1;

  return (
    <>
      <div style={{ overflowX: "auto", paddingTop: 18 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(32, minmax(20px, 1fr))",
            gap: 4,
            minWidth: 760,
          }}
        >
          {bitCells.map((bit, idx) => {
            const isBuilt = idx >= builtStart;
            const isPrepended = idx === prependedIndex;
            const isSumming = state.phase === "sum" && idx === state.index;

            return (
              <div
                key={idx}
                style={{
                  height: 34,
                  borderRadius: 6,
                  border: `1px solid ${
                    isSumming ? "#38bdf8" : isPrepended ? "#f59e0b" : "#2a2e3a"
                  }`,
                  background: isBuilt ? "#1c1f29" : "#11131a",
                  color: bit === "1" && isBuilt ? "#10b981" : "#8a8f98",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 14,
                  fontWeight: isBuilt ? 700 : 400,
                  boxShadow: isSumming
                    ? "0 0 0 2px #38bdf8 inset"
                    : isPrepended
                      ? "0 0 0 2px #f59e0b inset"
                      : undefined,
                }}
                title={`binaryN[${idx}]`}
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
          res<b>{state.res}</b>
        </div>
        <div className="stat best">
          {state.index === null ? "index" : `i=${state.index}`}<b>{state.bit ?? "-"}</b>
        </div>
        <div className="stat">
          binaryN<b>{state.binaryN || '""'}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const N = 43261596;

export function ReverseBitsViz() {
  const { states, answer } = useMemo(() => buildStates(N), []);
  const expected = useMemo(() => reverseBits(N), []);
  const ok = answer === expected;

  return (
    <>
      <h1>reverseBits({N})</h1>
      <p className="legend">
        Build <code>binaryN</code> by repeated division, left-pad it to 32 cells,
        then read the string left to right while adding each bit at power{" "}
        <code>2^i</code>. That last loop is the source implementation's reverse.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <ReverseBitsView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
