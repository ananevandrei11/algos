import { parseArgs } from "./parseArgs";

describe("parseArgs", () => {
  it("parses flag only", () => {
    expect(parseArgs(["--verbose"])).toEqual({ verbose: true });
  });

  it("parses short flag", () => {
    expect(parseArgs(["-d"])).toEqual({ d: true });
  });

  it("parses flag with value", () => {
    expect(parseArgs(["--name", "test"])).toEqual({ name: "test" });
  });

  it("parses flag with empty string value", () => {
    expect(parseArgs(["--key", ""])).toEqual({ key: true });
  });

  it("parses multiple flags and values", () => {
    expect(parseArgs(["--verbose", "-d", "output.log", "--name", "test"])).toEqual({
      verbose: true,
      d: "output.log",
      name: "test",
    });
  });

  it("treats next flag as flag, not value", () => {
    expect(parseArgs(["--flag1", "--flag2"])).toEqual({
      flag1: true,
      flag2: true,
    });
  });

  it("handles trailing flag without value", () => {
    expect(parseArgs(["--key"])).toEqual({ key: true });
  });

  it("ignores non-flag arguments", () => {
    expect(parseArgs(["--name", "test", "ignored"])).toEqual({ name: "test" });
  });

  it("returns empty object for empty input", () => {
    expect(parseArgs([])).toEqual({});
  });

  it("skips non-flag leading arguments", () => {
    expect(parseArgs(["value", "--flag"])).toEqual({ flag: true });
  });
});
