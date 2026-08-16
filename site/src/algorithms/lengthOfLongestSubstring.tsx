import { useMemo } from "react";
import { lengthOfLongestSubstring } from "@algos/lengthOfLongestSubstring/lengthOfLongestSubstring";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | {
      kind: "step";
      right: number;
      curr: string;
      hadDuplicate: boolean;
      dupOldIdx: number | null;
      newLeft: number;
      windowLen: number;
      updatedRes: boolean;
    };

interface State {
  chars: string[];
  left: number;
  right: number;
  mapEntries: [string, number][];
  res: number;
  log: LogEvent;
}

function buildStates(s: string): { states: State[]; answer: number } {
  const states: State[] = [];
  const chars = s.split("");
  const map = new Map<string, number>();
  let left = 0;
  let res = 0;

  for (let right = 0; right < s.length; right++) {
    const curr = s[right];
    let hadDuplicate = false;
    let dupOldIdx: number | null = null;
    if (map.has(curr)) {
      const a = map.get(curr) || 0;
      hadDuplicate = true;
      dupOldIdx = a;
      left = Math.max(a + 1, left);
    }
    map.set(curr, right);
    const prevRes = res;
    res = Math.max(res, right - left + 1);
    states.push({
      chars,
      left,
      right,
      mapEntries: Array.from(map.entries()),
      res,
      log: {
        kind: "step",
        right,
        curr,
        hadDuplicate,
        dupOldIdx,
        newLeft: left,
        windowLen: right - left + 1,
        updatedRes: res > prevRes,
      },
    });
  }

  return { states, answer: res };
}

function LogLine({ event }: { event: LogEvent }) {
  return (
    <span>
      right={event.right}: <code>'{event.curr}'</code>
      {event.hadDuplicate ? (
        <>
          {" "}
          already in map at {event.dupOldIdx} → advance <b className="c-left">L</b> to{" "}
          {event.newLeft}.{" "}
        </>
      ) : (
        <> new char. </>
      )}
      Window [{event.newLeft}..{event.right}] len={event.windowLen}.
      {event.updatedRes && (
        <span className="ok"> New best: {event.windowLen}</span>
      )}
    </span>
  );
}

function LengthOfLongestSubstringView({ state }: { state: State }) {
  return (
    <>
      <div className="array">
        {state.chars.map((ch, idx) => {
          const inWindow = idx >= state.left && idx <= state.right;
          const isRight = idx === state.right;
          const isLeft = idx === state.left;
          const cls = ["cell"];
          if (inWindow) cls.push("in-window");
          if (isRight) cls.push("right-edge");
          if (isLeft && !isRight) cls.push("left-edge");
          return (
            <div
              className={cls.join(" ")}
              key={idx}
              style={{ opacity: idx <= state.right ? 1 : 0.3 }}
            >
              <span className="idx">{idx}</span>
              {ch}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.chars.map((_, idx) => (
          <div className="ptr" key={idx}>
            {idx === state.left && idx !== state.right && (
              <span className="l">L</span>
            )}
            {idx === state.right && idx !== state.left && (
              <span className="r">R</span>
            )}
            {idx === state.right && idx === state.left && (
              <span className="l">L=R</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, display: "flex", gap: 28, alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 8 }}>
            map (char → last seen idx):
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 400 }}>
            {state.mapEntries.map(([ch, idx]) => (
              <div
                key={ch}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px",
                  borderRadius: 6,
                  border: "1px solid #2a2e3a",
                  background: "#161922",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "#f59e0b", fontFamily: "ui-monospace, monospace" }}>
                  '{ch}'
                </span>
                <span style={{ color: "#5a5f6a" }}>→</span>
                <span style={{ color: "#3b82f6", fontFamily: "ui-monospace, monospace" }}>
                  {idx}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="stats">
          <div className="stat best">
            <span>res</span>
            <b>{state.res}</b>
          </div>
        </div>
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const INPUT = "abcabcbb";

export function LengthOfLongestSubstringViz() {
  const { states, answer } = useMemo(() => buildStates(INPUT), []);
  const expected = useMemo(() => lengthOfLongestSubstring(INPUT), []);
  const ok = answer === expected;

  return (
    <>
      <h1>lengthOfLongestSubstring("{INPUT}")</h1>
      <p className="legend">
        Sliding window with a Map. <b className="c-left">L</b> and{" "}
        <b className="c-right">R</b> mark the window's edges; window length
        is <code>R − L + 1</code>. <b className="c-right">R</b> moves right
        one step at a time. When <code>s[R]</code> was seen before{" "}
        <em>and its last position is still inside the window</em>, advance{" "}
        <b className="c-left">L</b> to just past that position — this keeps
        every character in the window unique. The Map stores each
        character's most recent index so this check is O(1).
      </p>

      <StepPlayer
        states={states}
        render={(s) => <LengthOfLongestSubstringView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives ${answer}, src/ also gives ${expected}.`
          : `✗ Mismatch: visualization says ${answer}, but src/ returns ${expected}.`}
      </p>
    </>
  );
}
