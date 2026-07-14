import { mergeTwoSortedLists, type ListNode } from "./mergeTwoSortedLists";

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

describe("mergeTwoSortedLists", () => {
  it("merges two sorted linked lists", () => {
    const merged = mergeTwoSortedLists(buildList([1, 2, 4]), buildList([1, 3, 4]));
    expect(toArray(merged)).toEqual([1, 1, 2, 3, 4, 4]);
  });

  it("returns the second list when the first is empty", () => {
    const merged = mergeTwoSortedLists(null, buildList([0, 5]));
    expect(toArray(merged)).toEqual([0, 5]);
  });

  it("returns the first list when the second is empty", () => {
    const merged = mergeTwoSortedLists(buildList([2, 6]), null);
    expect(toArray(merged)).toEqual([2, 6]);
  });

  it("returns null when both lists are empty", () => {
    const merged = mergeTwoSortedLists(null, null);
    expect(merged).toBeNull();
  });
});
