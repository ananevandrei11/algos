import { useMemo } from "react";
import { maxProfitMedium } from "@algos/maxProfitMedium/maxProfitMedium";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "descend"; i: number }
  | { kind: "buy"; i: number; price: number }
  | { kind: "ascend"; i: number }
  | { kind: "sell"; i: number; price: number; gain: number; totalProfit: number }
  | { kind: "done"; profit: number };

type Phase = "valley" | "peak" | "done";

interface State {
  prices: number[];
  i: number;
  profit: number;
  buyIdx: number; // -1 when no open position
  phase: Phase;
  log: LogEvent;
}

function buildStates(prices: number[]): { states: State[]; answer: number } {
  const states: State[] = [];
  let profit = 0;
  let i = 0;
  let buyIdx = -1;

  while (i < prices.length - 1) {
    // valley scan (find local minimum)
    while (i < prices.length - 1 && prices[i] >= prices[i + 1]) {
      states.push({
        prices,
        i,
        profit,
        buyIdx,
        phase: "valley",
        log: { kind: "descend", i },
      });
      i++;
    }
    const buy = prices[i];
    buyIdx = i;
    states.push({
      prices,
      i,
      profit,
      buyIdx,
      phase: "valley",
      log: { kind: "buy", i, price: buy },
    });

    // peak scan (find local maximum)
    while (i < prices.length - 1 && prices[i] <= prices[i + 1]) {
      states.push({
        prices,
        i,
        profit,
        buyIdx,
        phase: "peak",
        log: { kind: "ascend", i },
      });
      i++;
    }
    const sell = prices[i];
    profit += sell - buy;
    states.push({
      prices,
      i,
      profit,
      buyIdx,
      phase: "peak",
      log: { kind: "sell", i, price: sell, gain: sell - buy, totalProfit: profit },
    });
    buyIdx = -1;
  }

  states.push({
    prices,
    i,
    profit,
    buyIdx: -1,
    phase: "done",
    log: { kind: "done", profit },
  });

  return { states, answer: profit };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "descend") {
    return (
      <span>
        prices[{event.i}] ≥ prices[{event.i + 1}] — still descending, skip.
      </span>
    );
  }
  if (event.kind === "buy") {
    return (
      <span>
        Valley found at index {event.i}. Buy at <code>{event.price}</code>.
      </span>
    );
  }
  if (event.kind === "ascend") {
    return (
      <span>
        prices[{event.i}] ≤ prices[{event.i + 1}] — still ascending, continue.
      </span>
    );
  }
  if (event.kind === "sell") {
    if (event.gain === 0) {
      return (
        <span>
          Peak at index {event.i}, price <code>{event.price}</code>. No gain
          (sell = buy). Profit stays at <code>{event.totalProfit}</code>.
        </span>
      );
    }
    return (
      <span>
        Peak at index {event.i}. Sell at <code>{event.price}</code>. Gain:{" "}
        <code>+{event.gain}</code>. Total profit:{" "}
        <code>{event.totalProfit}</code>.
      </span>
    );
  }
  return (
    <span className="ok">
      Done. Total profit: <code>{event.profit}</code>.
    </span>
  );
}

function MaxProfitMediumView({ state }: { state: State }) {
  const isDone = state.phase === "done";
  const isInPeak = state.phase === "peak";

  return (
    <>
      <div className="array">
        {state.prices.map((val, idx) => {
          const isI = !isDone && idx === state.i;
          const isBuy = state.buyIdx !== -1 && idx === state.buyIdx;
          const cls = ["cell"];
          if (isI && isInPeak) cls.push("right-edge");
          else if (isI) cls.push("left-edge");
          if (isBuy && !isI) cls.push("right-edge");
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
            {!isDone && idx === state.i && (
              <span className={isInPeak ? "r" : "l"}>i</span>
            )}
            {state.buyIdx !== -1 && idx === state.buyIdx && idx !== state.i && (
              <span className="r">B</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, fontSize: 13, color: "#9ca3af" }}>
        phase:{" "}
        <b style={{ color: "#e2e8f0" }}>
          {isDone ? "done" : state.phase === "valley" ? "valley scan" : "peak scan"}
        </b>
        {"    "}profit: <b style={{ color: "#e2e8f0" }}>{state.profit}</b>
      </div>

      <div className="log" style={{ marginTop: 12 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const PRICES = [7, 1, 5, 3, 6, 4];

export function MaxProfitMediumViz() {
  const { states, answer } = useMemo(() => buildStates(PRICES), []);
  const expected = useMemo(() => maxProfitMedium([...PRICES]), []);
  const ok = answer === expected;

  return (
    <>
      <h1>maxProfitMedium([{PRICES.join(", ")}])</h1>
      <p className="legend">
        Collect all ascending segments. Scan for the next valley (
        <b className="c-left">buy</b>) then the next peak (
        <b className="c-right">sell</b>), add the gain, repeat. Multiple
        transactions allowed.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <MaxProfitMediumView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
