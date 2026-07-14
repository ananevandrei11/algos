import { useMemo } from "react";
import {
  mergeTwoSortedLists,
  type ListNode,
} from "@algos/mergeTwoSortedLists/mergeTwoSortedLists";
import { StepPlayer } from "../components/StepPlayer";

type LogEvent =
  | { kind: "pick"; from: "list1" | "list2"; value: number; compare: [number, number] }
  | { kind: "attach-rest"; from: "list1" | "list2" | "none"; values: number[] }
  | { kind: "done"; answer: number[] };

interface State {
  merged: number[];
  list1: number[];
  list2: number[];
  currentIndex: number;
  log: LogEvent;
}

function buildList(values: number[]): ListNode | null {
  const dummy: ListNode = { val: 0, next: null };
  let current = dummy;

  for (const value of values) {
    current.next = { val: value, next: null };
    current = current.next;
  }

  return dummy.next;
}

function toArray(head: ListNode | null): number[] {
  const values: number[] = [];
  let current = head;

  while (current !== null) {
    values.push(current.val);
    current = current.next;
  }

  return values;
}

function buildStates(list1Values: number[], list2Values: number[]) {
  const states: State[] = [];
  let list1 = buildList(list1Values);
  let list2 = buildList(list2Values);
  const dummy: ListNode = { val: 0, next: null };
  let current = dummy;

  while (list1 !== null && list2 !== null) {
    const compare: [number, number] = [list1.val, list2.val];

    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
      current = current.next;
      states.push({
        merged: toArray(dummy.next),
        list1: toArray(list1),
        list2: toArray(list2),
        currentIndex: toArray(dummy.next).length - 1,
        log: { kind: "pick", from: "list1", value: current.val, compare },
      });
    } else {
      current.next = list2;
      list2 = list2.next;
      current = current.next;
      states.push({
        merged: toArray(dummy.next),
        list1: toArray(list1),
        list2: toArray(list2),
        currentIndex: toArray(dummy.next).length - 1,
        log: { kind: "pick", from: "list2", value: current.val, compare },
      });
    }
  }

  if (list1 !== null) {
    current.next = list1;
    states.push({
      merged: toArray(dummy.next),
      list1: [],
      list2: toArray(list2),
      currentIndex: toArray(dummy.next).length - 1,
      log: { kind: "attach-rest", from: "list1", values: toArray(list1) },
    });
  } else {
    current.next = list2;
    states.push({
      merged: toArray(dummy.next),
      list1: toArray(list1),
      list2: [],
      currentIndex: toArray(dummy.next).length - 1,
      log: { kind: "attach-rest", from: list2 !== null ? "list2" : "none", values: toArray(list2) },
    });
  }

  const answer = toArray(dummy.next);
  states.push({
    merged: answer,
    list1: [],
    list2: [],
    currentIndex: answer.length - 1,
    log: { kind: "done", answer },
  });

  return { states, answer };
}

function LogLine({ event }: { event: LogEvent }) {
  switch (event.kind) {
    case "pick":
      return (
        <span>
          Compare <code>{event.compare[0]}</code> and <code>{event.compare[1]}</code>. Take{" "}
          <code>{event.value}</code> from <span className="ok">{event.from}</span> and move
          <code> current</code> forward.
        </span>
      );
    case "attach-rest":
      return (
        <span>
          Main loop stopped. Attach the rest from <code>{event.from}</code>: [
          {event.values.length ? event.values.join(", ") : "empty"}].
        </span>
      );
    case "done":
      return (
        <span className="done">
          Done. Merged list = [{event.answer.join(", ")}].
        </span>
      );
  }
}

function ListRow({
  label,
  values,
  highlight,
}: {
  label: string;
  values: number[];
  highlight?: number | null;
}) {
  return (
    <>
      <div style={{ fontSize: 12, color: "#5a5f6a", marginBottom: 6 }}>{label}</div>
      <div className="array" style={{ marginTop: 0 }}>
        {(values.length ? values : [null]).map((value, index) => {
          const classes = ["cell"];
          if (highlight === index) classes.push("left-edge");

          return (
            <div className={classes.join(" ")} key={`${label}-${index}`}>
              <span className="idx">{value === null ? "" : index}</span>
              {value === null ? <span style={{ color: "#4b5563" }}>∅</span> : value}
            </div>
          );
        })}
      </div>
    </>
  );
}

function MergeTwoSortedListsView({ state }: { state: State }) {
  return (
    <>
      <div style={{ display: "grid", gap: 18 }}>
        <ListRow label="merged (dummy.next)" values={state.merged} highlight={state.currentIndex} />
        <ListRow label="list1 remaining" values={state.list1} highlight={state.list1.length ? 0 : null} />
        <ListRow label="list2 remaining" values={state.list2} highlight={state.list2.length ? 0 : null} />
      </div>

      <div className="stats" style={{ marginTop: 24 }}>
        <div className="stat">
          merged size<b>{state.merged.length}</b>
        </div>
        <div className="stat">
          list1 left<b>{state.list1.length}</b>
        </div>
        <div className="stat">
          list2 left<b>{state.list2.length}</b>
        </div>
      </div>

      <div className="log">
        <LogLine event={state.log} />
      </div>
    </>
  );
}

const LIST1 = [1, 2, 4];
const LIST2 = [1, 3, 4];

export function MergeTwoSortedListsViz() {
  const { states, answer } = useMemo(() => buildStates(LIST1, LIST2), []);
  const expected = useMemo(
    () => toArray(mergeTwoSortedLists(buildList(LIST1), buildList(LIST2))),
    [],
  );
  const ok =
    answer.length === expected.length && answer.every((value, index) => value === expected[index]);

  return (
    <>
      <h1>
        mergeTwoSortedLists([{LIST1.join(", ")}], [{LIST2.join(", ")}])
      </h1>
      <p className="legend">
        Standard dummy-head merge for two sorted linked lists. Compare the front nodes of{" "}
        <b className="c-left">list1</b> and <b className="c-right">list2</b>, link the smaller
        one after <code>current</code>, advance that list, then attach the remaining tail when one
        list runs out.
      </p>

      <StepPlayer
        states={states}
        render={(state) => <MergeTwoSortedListsView state={state} />}
      />

      <p className={ok ? "verify ok" : "verify fail"}>
        {ok
          ? `✓ Verified: visualization gives [${answer.join(", ")}], src/ also gives [${expected.join(", ")}].`
          : `✗ Mismatch: visualization says [${answer.join(", ")}], but src/ returns [${expected.join(", ")}].`}
      </p>
    </>
  );
}
