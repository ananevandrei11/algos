export interface ListNode {
  val: number;
  next: ListNode | null;
}

export function mergeTwoSortedLists(
  list1: ListNode | null,
  list2: ListNode | null,
): ListNode | null {
  const dummy: ListNode = { val: 0, next: null };
  let current = dummy;

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }

  if (list1 !== null) {
    current.next = list1;
  } else {
    current.next = list2;
  }

  return dummy.next;
}
