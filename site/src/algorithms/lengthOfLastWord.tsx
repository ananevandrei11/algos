import { useMemo } from "react";
import { lengthOfLastWord } from "@algos/lengthOfLastWord/lengthOfLastWord";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "skip"; i: number; ch: string }
  | { kind: "break"; i: number; ch: string }
  | { kind: "take"; i: number; ch: string; word: string }
  | { kind: "done"; word: string };

interface State {
  s: string;
  i: number;
  word: string;
  log: LogEvent;
}

function buildStates(s: string): { states: State[]; answer: number } {
  const states: State[] = [];
  const word: string[] = [];
  const length = s.length - 1;

  for (let i = length; i >= 0; i -= 1) {
    if ((i === length && s[i] === " ") || (s[i] === " " && word.length === 0)) {
      states.push({ s, i, word: word.join(""), log: { kind: "skip", i, ch: s[i] } });
      continue;
    }
    if (s[i] === " " && s[i + 1] !== " ") {
      states.push({ s, i, word: word.join(""), log: { kind: "break", i, ch: s[i] } });
      break;
    }
    word.unshift(s[i]);
    states.push({ s, i, word: word.join(""), log: { kind: "take", i, ch: s[i], word: word.join("") } });
  }

  states.push({ s, i: -1, word: word.join(""), log: { kind: "done", word: word.join("") } });
  return { states, answer: word.length };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "skip") {
    return (
      <span className="hint">
        index {event.i}: <code>' '</code> — trailing space or still-empty word buffer,
        skip.
      </span>
    );
  }
  if (event.kind === "break") {
    return (
      <span className="fail">
        index {event.i}: <code>' '</code> followed by a non-space — that's the boundary
        before the last word, stop.
      </span>
    );
  }
  if (event.kind === "take") {
    return (
      <span className="ok">
        index {event.i}: prepend '{event.ch}' → word buffer <code>"{event.word}"</code>.
      </span>
    );
  }
  return (
    <span className="done">
      scan finished. Last word is <code>"{event.word}"</code>, length{" "}
      <code>{event.word.length}</code>.
    </span>
  );
}

function LengthOfLastWordView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.s.split("").map((ch, idx) => {
          const cls = ["cell"];
          if (idx === state.i) cls.push("active");
          else if (idx > state.i) cls.push("visited");
          return (
            <div className={cls.join(" ")} key={idx}>
              <span className="idx">{idx}</span>
              {ch === " " ? "␣" : ch}
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: "#161922",
          border: "1px solid #2a2e3a",
          borderRadius: 8,
          padding: "16px 18px",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 18,
          marginTop: 16,
        }}
      >
        word: "{state.word}"
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const S = "   fly me   to   the moon  ";

export function LengthOfLastWordViz() {
  const { states, answer } = useMemo(() => buildStates(S), []);
  const expected = useMemo(() => lengthOfLastWord(S), []);
  const ok = answer === expected;

  return (
    <>
      <h1>lengthOfLastWord("{S}")</h1>
      <p className="legend">
        Scan the string from the right. Skip trailing spaces (and any leading space while
        the word buffer is still empty). Stop at the space right before the last word.
        Otherwise prepend each character onto the word buffer.
      </p>

      <StepPlayer states={states} render={(s) => <LengthOfLastWordView state={s} />} />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization returns ${answer}, src/ also returns ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
