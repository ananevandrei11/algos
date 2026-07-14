import { useMemo } from "react";
import { addBinary } from "@algos/addBinary/addBinary";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "init"; a: string; b: string }
  | { kind: "zeroReturn" }
  | {
      kind: "loop";
      iteration: number;
      aLengthBefore: number;
      bLengthBefore: number;
      aBit: number;
      bBit: number;
      carryBefore: number;
      sum: number;
      result: number;
      carryAfter: number;
      ab: string;
      aLengthAfter: number;
      bLengthAfter: number;
    }
  | { kind: "done"; ab: string };

interface State {
  iteration: number;
  aLength: number;
  bLength: number;
  activeA: number | null;
  activeB: number | null;
  aBit: number | null;
  bBit: number | null;
  carry: number;
  sum: number | null;
  result: number | null;
  ab: string;
  log: LogEvent;
}

function buildStates(a: string, b: string): { states: State[]; answer: string } {
  const states: State[] = [];

  states.push({
    iteration: 0,
    aLength: a.length - 1,
    bLength: b.length - 1,
    activeA: null,
    activeB: null,
    aBit: null,
    bBit: null,
    carry: 0,
    sum: null,
    result: null,
    ab: "",
    log: { kind: "init", a, b },
  });

  if (a === "0" && b === "0") {
    states.push({
      iteration: 0,
      aLength: a.length - 1,
      bLength: b.length - 1,
      activeA: null,
      activeB: null,
      aBit: null,
      bBit: null,
      carry: 0,
      sum: null,
      result: null,
      ab: "0",
      log: { kind: "zeroReturn" },
    });
    return { states, answer: "0" };
  }

  let aLength = a.length - 1;
  let bLength = b.length - 1;
  let carry = 0;
  let ab = "";
  let iteration = 0;

  while (aLength >= 0 || bLength >= 0 || carry > 0) {
    const aLengthBefore = aLength;
    const bLengthBefore = bLength;
    const carryBefore = carry;
    const aBit = aLength >= 0 ? Number(a[aLength]) : 0;
    const bBit = bLength >= 0 ? Number(b[bLength]) : 0;
    const sum = aBit + bBit + carry;
    const result = sum % 2;
    carry = Math.floor(sum / 2);
    ab = result + ab;
    aLength--;
    bLength--;
    iteration += 1;

    states.push({
      iteration,
      aLength,
      bLength,
      activeA: aLengthBefore >= 0 ? aLengthBefore : null,
      activeB: bLengthBefore >= 0 ? bLengthBefore : null,
      aBit,
      bBit,
      carry,
      sum,
      result,
      ab,
      log: {
        kind: "loop",
        iteration,
        aLengthBefore,
        bLengthBefore,
        aBit,
        bBit,
        carryBefore,
        sum,
        result,
        carryAfter: carry,
        ab,
        aLengthAfter: aLength,
        bLengthAfter: bLength,
      },
    });
  }

  states.push({
    iteration,
    aLength,
    bLength,
    activeA: null,
    activeB: null,
    aBit: null,
    bBit: null,
    carry,
    sum: null,
    result: null,
    ab,
    log: { kind: "done", ab },
  });

  return { states, answer: ab };
}

function bitCells(value: string, length: number): string[] {
  return value.padStart(length, " ").split("");
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "init":
      return (
        <span>
          Check the zero shortcut, then set <code>aLength={event.a.length - 1}</code>,{" "}
          <code>bLength={event.b.length - 1}</code>, <code>carry=0</code>, and{" "}
          <code>ab=""</code>.
        </span>
      );
    case "zeroReturn":
      return (
        <span className="done">
          Both inputs are <code>0</code>, so the source returns <code>"0"</code> before
          the loop.
        </span>
      );
    case "loop":
      return (
        <span>
          Loop {event.iteration}: read{" "}
          <code>
            a[{event.aLengthBefore}] = {event.aBit}
          </code>{" "}
          and{" "}
          <code>
            b[{event.bLengthBefore}] = {event.bBit}
          </code>
          , add carry <code>{event.carryBefore}</code> for sum <code>{event.sum}</code>.
          Prepend <code>{event.result}</code>, set carry to{" "}
          <code>{event.carryAfter}</code>, then decrement the indices to{" "}
          <code>{event.aLengthAfter}</code> and <code>{event.bLengthAfter}</code>.
        </span>
      );
    case "done":
      return (
        <span className="done">
          No input bits remain and carry is 0. Return <code>{event.ab}</code>.
        </span>
      );
  }
}

function BitRow({
  label,
  bits,
  active,
  length,
}: {
  label: string;
  bits: string;
  active: number | null;
  length: number;
}) {
  return (
    <div>
      <div className="hint" style={{ marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${length}, minmax(34px, 1fr))`,
          gap: 6,
        }}
      >
        {bitCells(bits, length).map((bit, index) => {
          const sourceIndex = index - (length - bits.length);
          const isRealBit = sourceIndex >= 0;
          const isActive = isRealBit && sourceIndex === active;

          return (
            <div
              key={`${label}-${index}`}
              style={{
                height: 38,
                borderRadius: 6,
                border: `1px solid ${isActive ? "#f59e0b" : "#2a2e3a"}`,
                background: isRealBit ? "#1c1f29" : "#11131a",
                color: isRealBit ? "#e6e6e6" : "#3f4654",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 15,
                fontWeight: isRealBit ? 700 : 400,
                boxShadow: isActive ? "0 0 0 2px #f59e0b inset" : undefined,
              }}
              title={isRealBit ? `${label}[${sourceIndex}]` : "padding"}
            >
              {bit}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddBinaryView({
  a,
  b,
  state,
}: {
  a: string;
  b: string;
  state: State;
}) {
  const rowLength = Math.max(a.length, b.length, state.ab.length, 1);

  return (
    <>
      <div style={{ display: "grid", gap: 14, overflowX: "auto", paddingTop: 8 }}>
        <div style={{ minWidth: Math.max(rowLength * 40, 260) }}>
          <BitRow label="a" bits={a} active={state.activeA} length={rowLength} />
        </div>
        <div style={{ minWidth: Math.max(rowLength * 40, 260) }}>
          <BitRow label="b" bits={b} active={state.activeB} length={rowLength} />
        </div>
        <div style={{ minWidth: Math.max(rowLength * 40, 260) }}>
          <BitRow label="ab" bits={state.ab} active={null} length={rowLength} />
        </div>
      </div>

      <div className="stats">
        <div className="stat target">
          carry<b>{state.carry}</b>
        </div>
        <div className="stat sum">
          sum<b>{state.sum ?? "-"}</b>
        </div>
        <div className="stat best">
          result<b>{state.result ?? "-"}</b>
        </div>
        <div className="stat">
          indices<b>{state.aLength}, {state.bLength}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const A = "1010";
const B = "1011";

export function AddBinaryViz() {
  const { states, answer } = useMemo(() => buildStates(A, B), []);
  const expected = useMemo(() => addBinary(A, B), []);
  const ok = answer === expected;

  return (
    <>
      <h1>addBinary("{A}", "{B}")</h1>
      <p className="legend">
        Walk right to left through both binary strings. Each loop adds the current
        bits and carry, prepends <code>sum % 2</code> to <code>ab</code>, stores{" "}
        <code>Math.floor(sum / 2)</code> as the next carry, then decrements both
        indices exactly like the source.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <AddBinaryView a={A} b={B} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
