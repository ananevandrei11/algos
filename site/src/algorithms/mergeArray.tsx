import { useMemo } from "react";
import { merge } from "@algos/mergeArray/mergeArray";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | {
      kind: "place";
      write: number;
      val: number;
      from: "nums1" | "nums2";
    }
  | { kind: "drain"; write: number; val: number }
  | { kind: "done" };

interface State {
  nums1: number[];
  nums2: number[];
  m: number;
  p1: number; // lastRealIndexNums1
  p2: number; // lastRealIndexNums2
  write: number; // lastIndexNums1
  log: LogEvent;
}

function buildStates(
  nums1Init: number[],
  m: number,
  nums2: number[],
  n: number
): { states: State[]; answer: number[] } {
  const states: State[] = [];
  const nums1 = [...nums1Init];

  let lastRealIndexNums1 = m - 1;
  let lastRealIndexNums2 = n - 1;
  let lastIndexNums1 = m + n - 1;

  while (lastRealIndexNums1 >= 0 && lastRealIndexNums2 >= 0) {
    const val1 = nums1?.[lastRealIndexNums1];
    const val2 = nums2?.[lastRealIndexNums2];
    if (val1 === undefined || val2 === undefined) break;
    if (val1 >= val2) {
      nums1[lastIndexNums1] = val1;
      lastRealIndexNums1 -= 1;
      states.push({
        nums1: [...nums1],
        nums2,
        m,
        p1: lastRealIndexNums1,
        p2: lastRealIndexNums2,
        write: lastIndexNums1,
        log: { kind: "place", write: lastIndexNums1, val: val1, from: "nums1" },
      });
    } else {
      nums1[lastIndexNums1] = val2;
      lastRealIndexNums2 -= 1;
      states.push({
        nums1: [...nums1],
        nums2,
        m,
        p1: lastRealIndexNums1,
        p2: lastRealIndexNums2,
        write: lastIndexNums1,
        log: { kind: "place", write: lastIndexNums1, val: val2, from: "nums2" },
      });
    }
    lastIndexNums1 -= 1;
  }

  while (lastRealIndexNums2 >= 0) {
    const val2 = nums2[lastRealIndexNums2];
    if (val2 === undefined) break;
    nums1[lastIndexNums1] = val2;
    lastRealIndexNums2 -= 1;
    states.push({
      nums1: [...nums1],
      nums2,
      m,
      p1: lastRealIndexNums1,
      p2: lastRealIndexNums2,
      write: lastIndexNums1,
      log: { kind: "drain", write: lastIndexNums1, val: val2 },
    });
    lastIndexNums1 -= 1;
  }

  return { states, answer: [...nums1] };
}

function LogLine({ event }: { event: LogEvent }) {
  if (event.kind === "place") {
    return (
      <span>
        Place <code>{event.val}</code> from {event.from} at index {event.write}.
        Advance {event.from === "nums1" ? "p1" : "p2"} left.
      </span>
    );
  }
  if (event.kind === "drain") {
    return (
      <span>
        Drain nums2: place <code>{event.val}</code> at index {event.write}.
      </span>
    );
  }
  return <span className="ok">Merge complete.</span>;
}

function MergeArrayView({ state }: { state: State }) {
  return (
    <>
      <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 6 }}>
        nums1 (m+n = {state.nums1.length} slots, first {state.m} are input):
      </div>
      <div className="array">
        {state.nums1.map((n, idx) => {
          const isWrite = idx === state.write;
          const isP1 = idx === state.p1;
          const isBuffer = idx >= state.m;
          const cls = ["cell"];
          if (isWrite && state.log.kind !== "done") {
            cls.push("right-edge");
          } else if (isP1 && idx < state.m) {
            cls.push("left-edge");
          }
          return (
            <div
              className={cls.join(" ")}
              key={idx}
              style={{
                background: isBuffer ? "#161429" : undefined,
                borderStyle: isBuffer ? "dashed" : undefined,
              }}
            >
              <span className="idx">{idx}</span>
              {n === 0 && isBuffer && state.log.kind !== "done" ? (
                <span style={{ color: "#3a3f4a" }}>0</span>
              ) : (
                n
              )}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.nums1.map((_, idx) => (
          <div className="ptr" key={idx}>
            {idx === state.p1 && idx < state.m && (
              <span className="l">p1</span>
            )}
            {idx === state.write && (
              <span className="r">W</span>
            )}
          </div>
        ))}
      </div>

      <div
        style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 6, marginTop: 28 }}
      >
        nums2:
      </div>
      <div className="array">
        {state.nums2.map((n, idx) => {
          const isP2 = idx === state.p2;
          const cls = ["cell"];
          if (isP2) cls.push("left-edge");
          return (
            <div
              className={cls.join(" ")}
              key={idx}
              style={{ opacity: idx <= state.p2 ? 1 : 0.35 }}
            >
              <span className="idx">{idx}</span>
              {n}
            </div>
          );
        })}
      </div>

      <div className="pointers">
        {state.nums2.map((_, idx) => (
          <div className="ptr" key={idx}>
            {idx === state.p2 && <span className="l">p2</span>}
          </div>
        ))}
      </div>

      <div className="log" style={{ marginTop: 16 }}>
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const NUMS1 = [1, 2, 3, 0, 0, 0];
const M = 3;
const NUMS2 = [2, 5, 6];
const N = 3;

export function MergeArrayViz() {
  const { states, answer } = useMemo(
    () => buildStates(NUMS1, M, NUMS2, N),
    []
  );
  const expectedNums1 = [...NUMS1];
  merge(expectedNums1, M, [...NUMS2], N);
  const ok =
    answer.length === expectedNums1.length &&
    answer.every((v, i) => v === expectedNums1[i]);

  return (
    <>
      <h1>
        merge([{NUMS1.join(", ")}], {M}, [{NUMS2.join(", ")}], {N})
      </h1>
      <p className="legend">
        Merge two sorted arrays in-place from the back. Three pointers:{" "}
        <b className="c-left">p1</b> (last real element in nums1),{" "}
        <b className="c-left">p2</b> (last element in nums2), and{" "}
        <b className="c-right">W</b> (write position). Always place the larger
        of the two candidates.
      </p>

      <StepPlayer
        states={states}
        render={(s) => <MergeArrayView state={s} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives [${answer.join(", ")}], src/ also gives [${expectedNums1.join(", ")}].`
          : `✗ Mismatch: visualization says [${answer.join(", ")}], but src/ returns [${expectedNums1.join(", ")}].`}
      </p>
    </>
  );
}
