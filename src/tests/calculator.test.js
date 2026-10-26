const { calculate } = require("../calculator");

describe("calculate", () => {
  describe("basic operations", () => {
    test("adds numbers", () => {
      expect(calculate("2 + 3")).toBe(5);
    });

    test("subtracts numbers", () => {
      expect(calculate("10 - 4")).toBe(6);
    });

    test("multiplies numbers", () => {
      expect(calculate("45 * 2")).toBe(90);
    });

    test("divides numbers", () => {
      expect(calculate("20 / 5")).toBe(4);
    });
  });

  describe("supported input", () => {
    test.each([
      ["unicode multiplication", "3 × 4", 12],
      ["unicode division", "12 ÷ 3", 4],
      ["negative numbers", "-8 + 3", -5],
      ["subtracting a negative number", "5 - -2", 7],
      ["decimal numbers", "1.5 * 2", 3],
      ["leading-decimal numbers", ".5 + .25", 0.75],
      ["trailing-decimal numbers", "2. + 1", 3],
      ["surrounding whitespace", "  7   /  2  ", 3.5],
    ])("handles %s", (_description, expression, expected) => {
      expect(calculate(expression)).toBe(expected);
    });
  });

  describe("invalid input and edge cases", () => {
    test.each(["/", "2 +", "2 + 3 + 4", "2 ^ 3", "1e2 + 1"])(
      "rejects malformed expression %s",
      (expression) => {
        expect(() => calculate(expression)).toThrow(
          "Enter an expression with two numbers and one basic operator.",
        );
      },
    );

    test.each([undefined, null, 2, {}])(
      "rejects non-string input %p",
      (expression) => {
        expect(() => calculate(expression)).toThrow(
          "Enter an expression with two numbers and one basic operator.",
        );
      },
    );

    test.each(["1 / 0", "1 / -0", "1 ÷ 0"])(
      "rejects division by zero in %s",
      (expression) => {
        expect(() => calculate(expression)).toThrow("Cannot divide by zero.");
      },
    );

    test("rejects results outside the supported numeric range", () => {
      expect(() => calculate(`${"9".repeat(400)} * 2`)).toThrow(
        "The result is outside the supported numeric range.",
      );
    });
  });
});
