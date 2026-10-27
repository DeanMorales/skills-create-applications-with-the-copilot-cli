#!/usr/bin/env node

const readline = require("node:readline");

function validateOperands(...operands) {
  if (!operands.every((operand) => Number.isFinite(operand))) {
    throw new Error("Operands must be finite numbers.");
  }
}

function validateResult(result) {
  if (!Number.isFinite(result)) {
    throw new Error("The result is outside the supported numeric range.");
  }
  return result;
}

function modulo(a, b) {
  validateOperands(a, b);
  if (b === 0) {
    throw new Error("Cannot modulo by zero.");
  }
  return validateResult(a % b);
}

function power(base, exponent) {
  validateOperands(base, exponent);
  return validateResult(base ** exponent);
}

function squareRoot(n) {
  validateOperands(n);
  if (n < 0) {
    throw new Error("Cannot take the square root of a negative number.");
  }
  return validateResult(Math.sqrt(n));
}

// Supports basic arithmetic, modulo (%), power (^), and square root (sqrt(...) or √...).
function calculate(expression) {
  if (typeof expression !== "string") {
    throw new Error("Enter an expression with two numbers and one basic operator.");
  }

  const number = "-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)";
  const squareRootMatch = expression.match(
    new RegExp(`^\\s*(?:sqrt\\s*\\(\\s*(${number})\\s*\\)|√\\s*(${number}))\\s*$`, "i"),
  );
  if (squareRootMatch) {
    return squareRoot(Number(squareRootMatch[1] ?? squareRootMatch[2]));
  }

  const match = expression.match(
    new RegExp(`^\\s*(${number})\\s*([+*/×÷%^-])\\s*(${number})\\s*$`),
  );

  if (!match) {
    throw new Error("Enter an expression with two numbers and one basic operator.");
  }

  const left = Number(match[1]);
  const operator = match[2];
  const right = Number(match[3]);
  let result;

  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("The result is outside the supported numeric range.");
  }
  switch (operator) {
    case "+":
      result = left + right;
      break;
    case "-":
      result = left - right;
      break;
    case "*":
    case "×":
      result = left * right;
      break;
    case "/":
    case "÷":
      if (right === 0) {
        throw new Error("Cannot divide by zero.");
      }
      result = left / right;
      break;
    case "%":
      result = modulo(left, right);
      break;
    case "^":
      result = power(left, right);
      break;
  }

  return validateResult(result);
}

function runCalculator() {
  const prompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Calculator: enter an expression, C to clear, or q to quit.");
  prompt.setPrompt("> ");
  prompt.prompt();

  prompt.on("line", (input) => {
    const command = input.trim();

    if (command.toLowerCase() === "q") {
      prompt.close();
      return;
    }

    if (command.toLowerCase() === "c") {
      console.log("Cleared.");
    } else if (command) {
      try {
        console.log(calculate(command));
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    }

    prompt.prompt();
  });
}

if (require.main === module) {
  runCalculator();
}

module.exports = { calculate, modulo, power, squareRoot };
