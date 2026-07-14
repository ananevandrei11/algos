import { useMemo } from "react";
import { isValidParentheses } from "@algos/isValidParentheses/isValidParentheses";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "odd-length"; length: number }
  | { kind: "scan"; i: number; char: string; stackBefore: string[] }
  | { kind: "push"; i: number; char: string; stackAfter: string[] }
  | {
      kind: "close";
      i: number;
      char: string;
      popped: string | undefined;
      expected: string | undefined;
      match: boolean;
      stackAfter: string[];
    }
  | { kind: "done"; answer: boolean; stackAfter: string[] };

interface State {
  i: number | null;
  currentChar: string | null;
  stack: string[];
  processed: number;
  log: LogEvent;
}

function buildStates(s: string): { states: State[]; answer: boolean } {
  const states: State[] = [];

  if (s.length % 2 !== 0) {
    states.push({
      i: null,
      currentChar: null,
      stack: [],
      processed: 0,
      log: { kind: "odd-length", length: s.length },
    });
    return { states, answer: false };
  }

  const mapSymbols: Record<string, string> = {
    "(": ")",
    "[": "]",
    "{": "}",
  };
  const opened: string[] = [];

  for (let i = 0; i < s.length; i += 1) {
    states.push({
      i,
      currentChar: s[i],
      stack: [...opened],
      processed: i,
      log: { kind: "scan", i, char: s[i], stackBefore: [...opened] },
    });

    if (mapSymbols[s[i]]) {
      opened.push(s[i]);
      states.push({
        i,
        currentChar: s[i],
        stack: [...opened],
        processed: i + 1,
        log: { kind: "push", i, char: s[i], stackAfter: [...opened] },
      });
    } else {
      const popped = opened.pop();
      const expected = popped ? mapSymbols[popped] : undefined;
      const match = expected === s[i];
      states.push({
        i,
        currentChar: s[i],
        stack: [...opened],
        processed: i + 1,
        log: {
          kind: "close",
          i,
          char: s[i],
          popped,
          expected,
          match,
          stackAfter: [...opened],
        },
      });

      if (!match) {
        return { states, answer: false };
      }
    }
  }

  const answer = opened.length === 0;
  states.push({
    i: null,
    currentChar: null,
    stack: [...opened],
    processed: s.length,
    log: { kind: "done", answer, stackAfter: [...opened] },
  });

  return { states, answer };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "odd-length":
      return (
        <span className="cut">
          Length is {event.length}, so the source returns <code>false</code> before the loop.
        </span>
      );
    case "scan":
      return (
        <span>
          i={event.i}: inspect <code>{event.char}</code> with stack [
          {event.stackBefore.length ? event.stackBefore.join(", ") : "empty"}].
        </span>
      );
    case "push":
      return (
        <span>
          <span className="ok">Opening bracket</span>: push <code>{event.char}</code> onto the
          stack.
        </span>
      );
    case "close":
      return (
        <span>
          Pop <code>{event.popped ?? "undefined"}</code>, expect{" "}
          <code>{event.expected ?? "undefined"}</code>, compare to <code>{event.char}</code>.{" "}
          {event.match ? (
            <span className="ok">Match, continue.</span>
          ) : (
            <span className="cut">Mismatch, return false.</span>
          )}
        </span>
      );
    case "done":
      return (
        <span className={event.answer ? "done" : "cut"}>
          Loop finished. <code>opened.length === 0</code> is {String(event.answer)}.
        </span>
      );
  }
}

function StackView({ stack, currentChar }: { stack: string[]; currentChar: string | null }) {
  const visible = stack.length ? stack : ["empty"];

  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 8 }}>opened stack</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          gap: 6,
          minHeight: 168,
          justifyContent: "flex-start",
        }}
      >
        {visible.map((value, index) => {
          const isEmpty = value === "empty";
          const isTop = !isEmpty && index === stack.length - 1;

          return (
            <div
              key={`${value}-${index}`}
              style={{
                height: 42,
                borderRadius: 8,
                border: `2px solid ${isTop ? "#f59e0b" : "#2a2e3a"}`,
                background: isEmpty ? "#111318" : "#161922",
                color: isEmpty ? "#4b5563" : "#e6e6e6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 700,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                boxShadow: isTop ? "0 0 0 2px #f59e0b inset" : undefined,
              }}
            >
              {value}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "#8a8f98" }}>
        top: {stack.length ? stack[stack.length - 1] : "empty"}
      </div>
      <div style={{ marginTop: 4, fontSize: 12, color: "#8a8f98" }}>
        current: {currentChar ?? "done"}
      </div>
    </div>
  );
}

function IsValidParenthesesView({ s, state }: { s: string; state: State }) {
  return (
    <>
      <div className="array">
        {[...s].map((char, index) => {
          const classes = ["cell"];
          if (index < state.processed) classes.push("in-window");
          if (index === state.i) classes.push("left-edge");

          return (
            <div className={classes.join(" ")} key={index}>
              <span className="idx">{index}</span>
              {char}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginTop: 24 }}>
        <StackView stack={state.stack} currentChar={state.currentChar} />

        <div className="stats" style={{ margin: 0, flexWrap: "wrap" }}>
          <div className="stat">
            index<b>{state.i ?? "-"}</b>
          </div>
          <div className="stat">
            processed<b>{state.processed}</b>
          </div>
          <div className="stat">
            stack size<b>{state.stack.length}</b>
          </div>
        </div>
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const INPUT = "([)]";

export function IsValidParenthesesViz() {
  const { states, answer } = useMemo(() => buildStates(INPUT), []);
  const expected = useMemo(() => isValidParentheses(INPUT), []);
  const ok = answer === expected;

  return (
    <>
      <h1>isValidParentheses("{INPUT}")</h1>
      <p className="legend">
        The source keeps an <b className="c-left">opened</b> stack. Opening brackets are pushed.
        For a closing bracket, it pops the top opening bracket, looks up the expected closing
        symbol, and compares it to the current character. This example shows the mismatch branch
        where the function returns <code>false</code> early.
      </p>

      <StepPlayer
        states={states}
        render={(state) => <IsValidParenthesesView s={INPUT} state={state} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${String(answer)}, src/ isValidParentheses also gives ${String(expected)}.`
          : `✗ Mismatch: visualization says ${String(answer)}, but src/ returns ${String(expected)}.`}
      </p>
    </>
  );
}
