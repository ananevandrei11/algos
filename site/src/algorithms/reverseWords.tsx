import { useMemo } from "react";
import { reverseWords } from "@algos/reverseWords/reverseWords";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "append"; char: string; wordIdx: number; word: string; wordDone: boolean }
  | { kind: "reverse"; wordIdx: number; word: string; result: string };

interface State {
  phase: 1 | 2;
  chars: string[];
  charIdx: number;
  sList: string[];
  wordIdx: number;
  reverseIdx: number;
  result: string;
  log: LogEvent;
}

function buildStates(s: string): { states: State[]; answer: string } {
  const states: State[] = [];
  const chars = s.split("");
  const sList: string[] = [];
  let count = 0;

  for (let i = 0; i < s.length; i += 1) {
    if (s[i] === " ") {
      continue;
    }
    if (s[i] !== " ") {
      const word = "";
      sList[count] = sList[count] === undefined ? word + s[i] : sList[count] + s[i];
    }
    const wordDone = s[i + 1] === " " || s[i + 1] === undefined;
    const currentWordIdx = count;
    if (s[i + 1] === " ") {
      count++;
    }
    states.push({
      phase: 1,
      chars,
      charIdx: i,
      sList: [...sList],
      wordIdx: currentWordIdx,
      reverseIdx: -1,
      result: "",
      log: {
        kind: "append",
        char: s[i],
        wordIdx: currentWordIdx,
        word: sList[currentWordIdx],
        wordDone,
      },
    });
  }

  let result = "";
  for (let i = sList.length - 1; i >= 0; i -= 1) {
    if (i === 0) {
      result += sList[i];
    } else {
      result = result + sList[i] + " ";
    }
    states.push({
      phase: 2,
      chars,
      charIdx: -1,
      sList: [...sList],
      wordIdx: -1,
      reverseIdx: i,
      result,
      log: { kind: "reverse", wordIdx: i, word: sList[i], result },
    });
  }

  return { states, answer: result };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "append") {
    return (
      <span>
        Append <code>'{event.char}'</code> → sList[{event.wordIdx}] ={" "}
        <code>'{event.word}'</code>
        {event.wordDone && <span className="ok"> — word complete.</span>}
      </span>
    );
  }
  return (
    <span>
      sList[{event.wordIdx}] = <code>'{event.word}'</code> → result ={" "}
      <code>'{event.result}'</code>
    </span>
  );
}

function ReverseWordsView({ state }: { state: State }) {
  return (
    <>
      <div className="array" style={{ gap: 4 }}>
        {state.chars.map((ch, idx) => {
          const isActive = idx === state.charIdx;
          const isSpace = ch === " ";
          const cls = ["cell"];
          if (isActive) cls.push("left-edge");
          return (
            <div
              className={cls.join(" ")}
              key={idx}
              style={{
                width: 36,
                height: 36,
                fontSize: 16,
                background: isSpace ? "#141720" : undefined,
                color: isSpace ? "#3a3f4a" : undefined,
              }}
            >
              <span className="idx">{idx}</span>
              {isSpace ? "·" : ch}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 28 }}>
        <span style={{ fontSize: 12, color: "#5a5f6a" }}>sList:</span>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {state.sList.map((word, idx) => {
            const isActive =
              state.phase === 1 ? idx === state.wordIdx : idx === state.reverseIdx;
            return (
              <div
                key={idx}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: `2px solid ${isActive ? "#f59e0b" : "#2a2e3a"}`,
                  background: isActive ? "#1e1a0f" : "#1c1f29",
                  fontSize: 15,
                  fontWeight: 600,
                  color: isActive ? "#f59e0b" : "#e6e6e6",
                  minWidth: 44,
                  textAlign: "center" as const,
                }}
              >
                <span style={{ fontSize: 11, color: "#5a5f6a", display: "block" }}>
                  [{idx}]
                </span>
                {word}
              </div>
            );
          })}
          {state.sList.length === 0 && (
            <span style={{ color: "#3a3f4a", fontSize: 13 }}>empty</span>
          )}
        </div>
      </div>

      {state.phase === 2 && (
        <div style={{ marginTop: 16 }}>
          <span style={{ fontSize: 12, color: "#5a5f6a" }}>result:</span>
          <div
            style={{
              marginTop: 6,
              padding: "8px 14px",
              borderRadius: 6,
              border: "2px solid #3b82f6",
              background: "#0e1e3f",
              fontSize: 15,
              fontFamily: "ui-monospace, monospace",
              color: "#3b82f6",
              display: "inline-block",
            }}
          >
            &quot;{state.result}&quot;
          </div>
        </div>
      )}

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const INPUT = "the sky is blue";

export function ReverseWordsViz() {
  const { states, answer } = useMemo(() => buildStates(INPUT), []);
  const expected = useMemo(() => reverseWords(INPUT), []);
  const ok = answer === expected;

  return (
    <>
      <h1>reverseWords(&quot;{INPUT}&quot;)</h1>
      <p className="legend">
        Phase 1: scan characters left-to-right, skipping spaces. Collect non-space chars
        into <code>sList[count]</code>; when the next char is a space, advance{" "}
        <code>count</code> to start a new word. Phase 2: iterate{" "}
        <code>sList</code> right-to-left and join with spaces.
      </p>

      <StepPlayer states={states} render={(s) => <ReverseWordsView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives "${answer}", src/ also gives "${expected}".`
          : `✗ Mismatch: visualization says "${answer}", but src/ returns "${expected}".`}
      </p>
    </>
  );
}
