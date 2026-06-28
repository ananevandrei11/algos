import { useMemo } from "react";
import { wordPattern } from "@algos/wordPattern/wordPattern";
import { StepPlayer } from "../components/StepPlayer";

// Traces the exact wordPattern implementation from src/:
// Split s into words, then for each position i check the bidirectional mapping
// charToWord (pattern-char → word) and wordToChar (word → pattern-char).
// States are plain data; view renders both maps as hash-table rows.

type LogEvent =
  | { kind: "step"; i: number; char: string; word: string; outcome: "ok" | "fail-char" | "fail-word" }
  | { kind: "done"; answer: boolean };

interface State {
  i: number;
  charToWordEntries: [string, string][];
  wordToCharEntries: [string, string][];
  currentChar: string | null;
  currentWord: string | null;
  log: LogEvent;
}

function buildStates(
  pattern: string,
  s: string,
): { states: State[]; answer: boolean } {
  const states: State[] = [];
  const words = s.split(" ");

  if (pattern.length !== words.length) {
    return { states, answer: false };
  }

  const charToWord = new Map<string, string>();
  const wordToChar = new Map<string, string>();

  for (let i = 0; i < pattern.length; i++) {
    const c = pattern[i];
    const w = words[i];

    if (charToWord.has(c) && charToWord.get(c) !== w) {
      states.push({
        i,
        charToWordEntries: Array.from(charToWord.entries()),
        wordToCharEntries: Array.from(wordToChar.entries()),
        currentChar: c,
        currentWord: w,
        log: { kind: "step", i, char: c, word: w, outcome: "fail-char" },
      });
      states.push({
        i,
        charToWordEntries: Array.from(charToWord.entries()),
        wordToCharEntries: Array.from(wordToChar.entries()),
        currentChar: null,
        currentWord: null,
        log: { kind: "done", answer: false },
      });
      return { states, answer: false };
    }
    if (wordToChar.has(w) && wordToChar.get(w) !== c) {
      states.push({
        i,
        charToWordEntries: Array.from(charToWord.entries()),
        wordToCharEntries: Array.from(wordToChar.entries()),
        currentChar: c,
        currentWord: w,
        log: { kind: "step", i, char: c, word: w, outcome: "fail-word" },
      });
      states.push({
        i,
        charToWordEntries: Array.from(charToWord.entries()),
        wordToCharEntries: Array.from(wordToChar.entries()),
        currentChar: null,
        currentWord: null,
        log: { kind: "done", answer: false },
      });
      return { states, answer: false };
    }
    charToWord.set(c, w);
    wordToChar.set(w, c);
    states.push({
      i,
      charToWordEntries: Array.from(charToWord.entries()),
      wordToCharEntries: Array.from(wordToChar.entries()),
      currentChar: c,
      currentWord: w,
      log: { kind: "step", i, char: c, word: w, outcome: "ok" },
    });
  }

  states.push({
    i: pattern.length,
    charToWordEntries: Array.from(charToWord.entries()),
    wordToCharEntries: Array.from(wordToChar.entries()),
    currentChar: null,
    currentWord: null,
    log: { kind: "done", answer: true },
  });

  return { states, answer: true };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "step":
      if (event.outcome === "ok") {
        return (
          <span>
            i={event.i}: <code>'{event.char}'</code> → <code>"{event.word}"</code>.{" "}
            <span className="ok">mapping consistent ✓</span>
          </span>
        );
      }
      if (event.outcome === "fail-char") {
        return (
          <span>
            i={event.i}: <code>'{event.char}'</code> already mapped to a different word.{" "}
            <span className="cut">→ return false</span>
          </span>
        );
      }
      return (
        <span>
          i={event.i}: <code>"{event.word}"</code> already mapped to a different char.{" "}
          <span className="cut">→ return false</span>
        </span>
      );
    case "done":
      return (
        <span className={event.answer ? "ok" : "cut"}>
          Done. Answer = {String(event.answer)}.
        </span>
      );
  }
}

function PairTable({
  label,
  entries,
  activeKey,
  keyColor,
  valColor,
}: {
  label: string;
  entries: [string, string][];
  activeKey: string | null;
  keyColor: string;
  valColor: string;
}) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {entries.map(([k, v]) => {
          const isActive = k === activeKey;
          return (
            <div
              key={k}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 6,
                border: `1px solid ${isActive ? keyColor : "#2a2e3a"}`,
                background: isActive ? "#1a1a2e" : "#161922",
                fontSize: 13,
              }}
            >
              <span style={{ color: keyColor, fontFamily: "ui-monospace, monospace" }}>
                '{k}'
              </span>
              <span style={{ color: "#5a5f6a" }}>→</span>
              <span style={{ color: valColor, fontFamily: "ui-monospace, monospace" }}>
                "{v}"
              </span>
            </div>
          );
        })}
        {entries.length === 0 && (
          <span style={{ color: "#3a3f4a", fontSize: 13 }}>empty</span>
        )}
      </div>
    </div>
  );
}

function WordPatternView({
  pattern,
  words,
  state,
}: {
  pattern: string;
  words: string[];
  state: State;
}) {
  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {[...pattern].map((ch, i) => {
          const isCurrent = i === state.i;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div
                className={["cell", isCurrent ? "left-edge" : ""].join(" ")}
                style={{ minWidth: 60, textAlign: "center" }}
              >
                <span className="idx">{i}</span>
                {ch}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: isCurrent ? "#10b981" : "#5a5f6a",
                  fontFamily: "ui-monospace, monospace",
                  textAlign: "center",
                }}
              >
                {words[i]}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        <PairTable
          label="charToWord (char → word)"
          entries={state.charToWordEntries}
          activeKey={state.currentChar}
          keyColor="#f59e0b"
          valColor="#3b82f6"
        />
        <PairTable
          label="wordToChar (word → char)"
          entries={state.wordToCharEntries}
          activeKey={state.currentWord}
          keyColor="#3b82f6"
          valColor="#f59e0b"
        />
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const PATTERN = "abba";
const S = "dog cat cat dog";

export function WordPatternViz() {
  const words = S.split(" ");
  const { states, answer } = useMemo(() => buildStates(PATTERN, S), []);
  const expected = useMemo(() => wordPattern(PATTERN, S), []);
  const ok = answer === expected;

  return (
    <>
      <h1>
        wordPattern("{PATTERN}", "{S}")
      </h1>
      <p className="legend">
        Maintain two maps: <b className="c-left">charToWord</b> (pattern char → word) and{" "}
        <b className="c-right">wordToChar</b> (word → pattern char). At each position, if
        either map has a conflicting mapping, return false. Otherwise register both and continue.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <WordPatternView pattern={PATTERN} words={words} state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ wordPattern also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
