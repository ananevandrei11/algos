import { wordPattern } from "./wordPattern";

describe("wordPattern", () => {
  it("abba true", () => {
    expect(wordPattern("abba", "dog cat cat dog")).toBe(true);
  });
  it("abba false", () => {
    expect(wordPattern("abba", "dog cat cat fish")).toBe(false);
  });
  it("aaaa false", () => {
    expect(wordPattern("aaaa", "dog cat cat dog")).toBe(false);
  });
  it("abab false", () => {
    expect(wordPattern("abab", "dog cat cat dog")).toBe(false);
  });
  it("abba - dog constructor constructor dog - true", () => {
    expect(wordPattern("abba", "dog constructor constructor dog")).toBe(true);
  });
});
