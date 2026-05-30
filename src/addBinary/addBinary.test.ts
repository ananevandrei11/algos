import { addBinary } from "./addBinary";

describe("addBinary", () => {
  // it("adds with a single carry", () => {
  //   expect(addBinary("11", "1")).toBe("100");
  // });

  // it("adds two multi-bit numbers", () => {
  //   expect(addBinary("1010", "1011")).toBe("10101");
  // });

  // it("adds two zeros", () => {
  //   expect(addBinary("0", "0")).toBe("0");
  // });

  // it("adds zero to a number", () => {
  //   expect(addBinary("0", "1101")).toBe("1101");
  //   expect(addBinary("1101", "0")).toBe("1101");
  // });

  // it("adds numbers of different lengths", () => {
  //   expect(addBinary("1", "111")).toBe("1000");
  // });

  // it("adds without any carry", () => {
  //   expect(addBinary("100", "11")).toBe("111");
  // });

  // it("propagates carry through all digits", () => {
  //   expect(addBinary("1111", "1111")).toBe("11110");
  // });

  // it("adds two single ones", () => {
  //   expect(addBinary("1", "1")).toBe("10");
  // });

  // it("handles a long carry chain", () => {
  //   expect(addBinary("11111111", "1")).toBe("100000000");
  // });

  // it("adds large binary strings", () => {
  //   expect(addBinary("110010101", "1011101")).toBe("111110010");
  // });

  it("adds large binary strings", () => {
    expect(
      addBinary(
        "10100000100100110110010000010101111011011001101110111111111101000000101111001110001111100001101",
        "110101001011101110001111100110001010100001101011101010000011011011001011101111001100000011011110011",
      ),
    ).toBe("110111101100010011000101110110100000011101000101011001000011011000001100011110011010010011000000000");
  });
});
