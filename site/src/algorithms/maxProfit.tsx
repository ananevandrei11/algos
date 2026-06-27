import { useMemo } from "react";
import { maxProfit } from "@algos/maxProfit/maxProfit";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | {
      kind: "step";
      i: number;
      currProfit: number;
      newMin: boolean;
      newMaxProfit: boolean;
    }
  | { kind: "done"; maxProfit: number };

interface State {
  prices: number[];
  i: number;
  minPrice: number;
  minIdx: number;
  maxProfit: number;
  log: LogEvent;
}

function buildStates(prices: number[]): { states: State[]; answer: number } {
  const states: State[] = [];
  let minPrice = prices[0];
  let minIdx = 0;
  let curMaxProfit = 0;

  for (let i = 1; i < prices.length; i += 1) {
    const curr = prices[i];
    const newMin = curr < minPrice;
    if (newMin) {
      minPrice = curr;
      minIdx = i;
    }
    const currProfit = curr - minPrice;
    const newMaxProfit = currProfit > curMaxProfit;
    curMaxProfit = newMaxProfit ? currProfit : curMaxProfit;

    states.push({
      prices,
      i,
      minPrice,
      minIdx,
      maxProfit: curMaxProfit,
      log: { kind: "step", i, currProfit, newMin, newMaxProfit },
    });
  }

  states.push({
    prices,
    i: prices.length - 1,
    minPrice,
    minIdx,
    maxProfit: curMaxProfit,
    log: { kind: "done", maxProfit: curMaxProfit },
  });

  return { states, answer: curMaxProfit };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "step") {
    const parts: string[] = [];
    if (event.newMin) parts.push("new minimum price found");
    if (event.newMaxProfit)
      parts.push(`new best profit: ${event.currProfit}`);
    if (!event.newMin && !event.newMaxProfit)
      parts.push(`profit here: ${event.currProfit} — no improvement`);
    return <span>{parts.join("; ")}.</span>;
  }
  return (
    <span className="ok">
      Done. Max profit: <code>{event.maxProfit}</code>.
    </span>
  );
}

function MaxProfitView({ state }: { state: State }) {
  const isDone = state.log.kind === "done";

  return (
    <>
      <div className="array">
        {state.prices.map((val, idx) => {
          const isI = !isDone && idx === state.i;
          const isMin = idx === state.minIdx;
          const cls = ["cell"];
          if (isI) cls.push("left-edge");
          if (isMin && !isI) cls.push("right-edge");
          return (
            <div key={idx} className={cls.join(" ")}>
              <span className="idx">{idx}</span>
              {val}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.prices.map((_, idx) => (
          <div className="ptr" key={idx}>
            {!isDone && idx === state.i && <span className="l">i</span>}
            {idx === state.minIdx && <span className="r">min</span>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, fontSize: 13, color: "#9ca3af" }}>
        minPrice:{" "}
        <b style={{ color: "#e2e8f0" }}>{state.minPrice}</b>
        {"    "}maxProfit:{" "}
        <b style={{ color: "#e2e8f0" }}>{state.maxProfit}</b>
      </div>

      <div className="log" style={{ marginTop: 12 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const PRICES = [7, 1, 5, 3, 6, 4];

export function MaxProfitViz() {
  const { states, answer } = useMemo(() => buildStates(PRICES), []);
  const expected = useMemo(() => maxProfit([...PRICES]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>maxProfit([{PRICES.join(", ")}])</h1>
      <p className="legend">
        Single pass. Track <b className="c-right">min</b> (cheapest buy price
        seen so far) and the best profit. At each <b className="c-left">i</b>,
        update the minimum, compute <code>prices[i] - minPrice</code>, and keep
        the best.
      </p>

      <StepPlayer states={states} render={(s) => <MaxProfitView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
