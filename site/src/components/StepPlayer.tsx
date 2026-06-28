import { useEffect, useReducer, type ReactNode } from "react";

// Generic step player: walks an ordered list of states and renders the current
// one via the provided `render`. Knows nothing about any specific algorithm —
// it only owns the stepping mechanics (Step / Auto / Reset).
//
// index === -1 means "before the first step" (nothing shown yet).

interface PlayerState {
  index: number;
  auto: boolean;
}

type Action =
  | { type: "step"; last: number }
  | { type: "reset" }
  | { type: "toggleAuto" }
  | { type: "stopAuto" };

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case "step":
      return state.index < action.last
        ? { ...state, index: state.index + 1 }
        : { ...state, auto: false };
    case "reset":
      return { index: -1, auto: false };
    case "toggleAuto":
      return { ...state, auto: !state.auto };
    case "stopAuto":
      return { ...state, auto: false };
  }
}

interface Props<S> {
  states: S[];
  render: (state: S) => ReactNode;
}

export function StepPlayer<S>({ states, render }: Props<S>) {
  const last = states.length - 1;
  const [{ index, auto }, dispatch] = useReducer(reducer, {
    index: -1,
    auto: false,
  });

  useEffect(() => {
    if (!auto) return;
    if (index >= last) {
      dispatch({ type: "stopAuto" });
      return;
    }
    const id = setInterval(() => dispatch({ type: "step", last }), 900);
    return () => clearInterval(id);
  }, [auto, index, last]);

  const current = index >= 0 ? states[index] : null;

  return (
    <div>
      <div className="stage">
        {current ? render(current) : <p className="hint">Press “Step” to begin.</p>}
      </div>

      <div className="controls">
        <button onClick={() => dispatch({ type: "step", last })} disabled={index >= last}>
          Step ▶
        </button>
        <button className="ghost" onClick={() => dispatch({ type: "toggleAuto" })}>
          {auto ? "Pause ⏸" : "Auto ⏩"}
        </button>
        <button className="ghost" onClick={() => dispatch({ type: "reset" })}>
          Reset ↺
        </button>
      </div>
    </div>
  );
}
