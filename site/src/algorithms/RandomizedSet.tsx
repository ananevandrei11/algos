import { useMemo } from "react";
import { RandomizedSet } from "@algos/RandomizedSet/RandomizedSet";
import { StepPlayer } from "../components/StepPlayer";

// Traces the exact RandomizedSet class from src/: a mutable data structure
// driven by a sequence of method calls, not a single-input function. We
// mirror the class's two fields — `arr: number[]` and `obj: Record<string, number>`
// (val -> index) — and push one state per meaningful internal step of each
// call: the existence check, the array/object mutation, and (for remove) the
// delete. `callIndex`/`op` tag which of the 6 calls each state belongs to so
// the view can show a call-sequence banner.

type LogEvent =
  | { kind: "insert-check"; val: number; exists: boolean }
  | { kind: "insert-write"; val: number; index: number }
  | { kind: "remove-check"; val: number; exists: boolean }
  | { kind: "remove-pop"; val: number; index: number }
  | {
      kind: "remove-swap";
      val: number;
      index: number;
      moved: number;
      lastIndex: number;
    }
  | { kind: "remove-delete"; val: number }
  | { kind: "getRandom"; randomIndex: number; result: number };

interface State {
  arr: number[];
  obj: Record<string, number>;
  callIndex: number;
  op: string;
  lastReturn: boolean | number | null;
  log: LogEvent;
}

const CALLS: { op: string; kind: "insert" | "remove" | "getRandom"; val?: number }[] = [
  { op: "insert(1)", kind: "insert", val: 1 },
  { op: "remove(2)", kind: "remove", val: 2 },
  { op: "insert(2)", kind: "insert", val: 2 },
  { op: "remove(1)", kind: "remove", val: 1 },
  { op: "insert(2)", kind: "insert", val: 2 },
  { op: "getRandom()", kind: "getRandom" },
];

function buildStates(): {
  states: State[];
  answer: (boolean | number)[];
} {
  const states: State[] = [];
  const returns: (boolean | number)[] = [];

  // Mirrors the class fields exactly.
  let arr: number[] = [];
  let obj: Record<string, number> = {};

  const snapshot = () => ({ arr: [...arr], obj: { ...obj } });

  CALLS.forEach((call, callIndex) => {
    let lastReturn: boolean | number | null = null;

    if (call.kind === "insert") {
      const val = call.val!;
      const exists = String(val) in obj;
      states.push({
        ...snapshot(),
        callIndex,
        op: call.op,
        lastReturn,
        log: { kind: "insert-check", val, exists },
      });

      if (exists) {
        lastReturn = false;
      } else {
        arr.push(val);
        const index = arr.length - 1;
        obj[val] = index;
        lastReturn = true;
        states.push({
          ...snapshot(),
          callIndex,
          op: call.op,
          lastReturn,
          log: { kind: "insert-write", val, index },
        });
      }
    } else if (call.kind === "remove") {
      const val = call.val!;
      const is = String(val) in obj;
      states.push({
        ...snapshot(),
        callIndex,
        op: call.op,
        lastReturn,
        log: { kind: "remove-check", val, exists: is },
      });

      if (!is) {
        lastReturn = false;
      } else {
        const index = obj[val];
        if (index === arr.length - 1) {
          arr.pop();
          states.push({
            ...snapshot(),
            callIndex,
            op: call.op,
            lastReturn,
            log: { kind: "remove-pop", val, index },
          });
        } else {
          const lastIndex = arr.length - 1;
          const temp = arr[lastIndex];
          obj[temp] = index;
          arr[lastIndex] = val;
          arr[index] = temp;
          arr.pop();
          states.push({
            ...snapshot(),
            callIndex,
            op: call.op,
            lastReturn,
            log: { kind: "remove-swap", val, index, moved: temp, lastIndex },
          });
        }
        delete obj[val];
        lastReturn = true;
        states.push({
          ...snapshot(),
          callIndex,
          op: call.op,
          lastReturn,
          log: { kind: "remove-delete", val },
        });
      }
    } else {
      const randomIndex = 0; // arr has exactly one element at this point in the trace
      const result = arr[randomIndex];
      lastReturn = result;
      states.push({
        ...snapshot(),
        callIndex,
        op: call.op,
        lastReturn,
        log: { kind: "getRandom", randomIndex, result },
      });
    }

    returns.push(lastReturn as boolean | number);
  });

  return { states, answer: returns };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "insert-check":
      return (
        <span>
          <code>insert({event.val})</code>: <code>String({event.val}) in obj</code> is{" "}
          {event.exists ? (
            <span className="cut">true → return false.</span>
          ) : (
            <span>false, so proceed.</span>
          )}
        </span>
      );
    case "insert-write":
      return (
        <span>
          <code>arr.push({event.val})</code>; <code>index = arr.length - 1 = {event.index}</code>;{" "}
          <code>obj[{event.val}] = {event.index}</code>.{" "}
          <span className="ok">Return true.</span>
        </span>
      );
    case "remove-check":
      return (
        <span>
          <code>remove({event.val})</code>: <code>String({event.val}) in obj</code> is{" "}
          {event.exists ? (
            <span>true, so proceed.</span>
          ) : (
            <span className="cut">false → return false.</span>
          )}
        </span>
      );
    case "remove-pop":
      return (
        <span>
          <code>index ({event.index})</code> is the last slot → <code>arr.pop()</code>.
        </span>
      );
    case "remove-swap":
      return (
        <span>
          <code>index ({event.index})</code> isn't last. Move last element{" "}
          <code>{event.moved}</code> (at {event.lastIndex}) into slot {event.index}:{" "}
          <code>obj[{event.moved}] = {event.index}</code>, <code>arr[{event.lastIndex}] = {event.val}</code>,{" "}
          <code>arr[{event.index}] = {event.moved}</code>, then <code>arr.pop()</code>.
        </span>
      );
    case "remove-delete":
      return (
        <span>
          <code>delete obj[{event.val}]</code>. <span className="ok">Return true.</span>
        </span>
      );
    case "getRandom":
      return (
        <span>
          <code>getRandom()</code>: <code>Math.floor(Math.random() * arr.length) = {event.randomIndex}</code>.
          Return <code>arr[{event.randomIndex}] = {event.result}</code>.
        </span>
      );
  }
}

function MapTable({
  entries,
  activeKey,
}: {
  entries: [string, number][];
  activeKey: string | null;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {entries.map(([k, v]) => {
        const isActive = k === activeKey;
        return (
          <div
            key={k}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 6,
              border: `1px solid ${isActive ? "#38bdf8" : "#2a2e3a"}`,
              background: isActive ? "#1a1a2e" : "#161922",
              fontSize: 13,
            }}
          >
            <span style={{ color: "#38bdf8", fontFamily: "ui-monospace, monospace" }}>{k}</span>
            <span style={{ color: "#5a5f6a" }}>→</span>
            <span style={{ color: "#3b82f6", fontFamily: "ui-monospace, monospace" }}>{v}</span>
          </div>
        );
      })}
      {entries.length === 0 && (
        <span style={{ color: "#3a3f4a", fontSize: 13 }}>empty</span>
      )}
    </div>
  );
}

function CallSequence({ callIndex }: { callIndex: number }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
      {CALLS.map((call, i) => {
        const isActive = i === callIndex;
        const isPast = i < callIndex;
        return (
          <div
            key={i}
            style={{
              padding: "4px 10px",
              borderRadius: 6,
              border: `1px solid ${isActive ? "#f59e0b" : "#2a2e3a"}`,
              background: isActive ? "#1c1f29" : "#161922",
              color: isActive ? "#f59e0b" : isPast ? "#8a8f98" : "#5a5f6a",
              fontFamily: "ui-monospace, monospace",
              fontSize: 12,
            }}
          >
            {call.op}
          </div>
        );
      })}
    </div>
  );
}

function RandomizedSetView({ state }: { state: State }) {
  const activeKey =
    "val" in state.log ? String((state.log as { val: number }).val) : null;

  return (
    <>
      <CallSequence callIndex={state.callIndex} />

      <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 6 }}>
        arr (backing array):
      </div>
      <div className="array">
        {state.arr.length === 0 ? (
          <div className="cell" style={{ color: "#3a3f4a" }}>
            empty
          </div>
        ) : (
          state.arr.map((n, idx) => (
            <div className="cell" key={idx}>
              <span className="idx">{idx}</span>
              {n}
            </div>
          ))
        )}
      </div>

      <div style={{ fontSize: 12, color: "#5a5f6a", margin: "16px 0 6px" }}>
        obj (val → index):
      </div>
      <MapTable
        entries={Object.entries(state.obj)}
        activeKey={activeKey}
      />

      <div className="stats" style={{ marginTop: 16 }}>
        <div className="stat target">
          arr.length<b>{state.arr.length}</b>
        </div>
        <div className="stat sum">
          call<b>{state.op}</b>
        </div>
        <div className="stat best">
          lastReturn<b>{state.lastReturn === null ? "—" : String(state.lastReturn)}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

export function RandomizedSetViz() {
  const { states, answer } = useMemo(() => buildStates(), []);

  const expected = useMemo(() => {
    const rs = new RandomizedSet();
    const results: (boolean | number)[] = [];
    results.push(rs.insert(1));
    results.push(rs.remove(2));
    results.push(rs.insert(2));
    results.push(rs.remove(1));
    results.push(rs.insert(2));
    results.push(rs.getRandom());
    return results;
  }, []);

  const ok =
    answer.length === expected.length &&
    answer.every((v, i) => v === expected[i]);

  return (
    <>
      <h1>RandomizedSet: insert(1), remove(2), insert(2), remove(1), insert(2), getRandom()</h1>
      <p className="legend">
        A set backed by an array <code>arr</code> (for O(1) random access) and a
        hash map <code>obj</code> (val → index in arr, for O(1) lookup).{" "}
        <code>insert</code> appends and records the index.{" "}
        <code>remove</code> swaps the target with the last element (updating the
        moved element's index) before popping, so removal stays O(1) without
        leaving a gap.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <RandomizedSetView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns [${answer.join(", ")}], src/ RandomizedSet also returns [${expected.join(", ")}].`
          : `✗ Mismatch: visualization says [${answer.join(", ")}], but src/ returns [${expected.join(", ")}].`}
      </p>
    </>
  );
}
