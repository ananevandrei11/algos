export class RandomizedSet {
  arr: number[] = [];
  obj: Record<string, number> = {};

  constructor() {
    this.obj = {};
    this.arr = [];
  }

  insert(val: number): boolean {
    if (String(val) in this.obj) {
      return false;
    }
    this.arr.push(val);
    const index = this.arr.length - 1;
    this.obj[val] = index;
    return true;
  }

  remove(val: number): boolean {
    const is = String(val) in this.obj;
    if (!is) {
      return false;
    }
    const index = this.obj[val];
    if (index === this.arr.length - 1) {
      this.arr.pop();
    } else {
      let temp = this.arr[this.arr.length - 1];
      this.obj[temp] = index;
      this.arr[this.arr.length - 1] = val;
      this.arr[index] = temp;
      this.arr.pop();
    }
    delete this.obj[val];
    return true;
  }

  getRandom(): number {
    const randomIndex = Math.floor(Math.random() * this.arr.length);
    return this.arr[randomIndex];
  }
}

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */
