#!/usr/bin/env node

const readline = require("node:readline");

// Supports addition (+), subtraction (-), multiplication (* or ×), and division (/ or ÷).
function calculate(expression) {
  if (typeof expression !== "string") {
    throw new Error("Enter an expression with two numbers and one basic operator.");
  }

  const number = "-?(?:\\d+(?:\\.\\d*)?|\\.\\d+)";
  const match = expression.match(
    new RegExp(`^\\s*(${number})\\s*([+*/×÷-])\\s*(${number})\\s*$`),
  );

  if (!match) {
    throw new Error("Enter an expression with two numbers and one basic operator.");
  }

  const left = Number(match[1]);
  const operator = match[2];
  const right = Number(match[3]);
  let result;

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
  }

  if (!Number.isFinite(result)) {
    throw new Error("The result is outside the supported numeric range.");
  }

  return result;
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

module.exports = { calculate };
