import os from "os";
import readline from "readline";
import { addOrderToClient } from "./add-client-order.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function processOrder(input) {
  const [type, price, amount] = input.split(" ");

  if (!type || isNaN(price) || isNaN(amount)) {
    console.log("Invalid input. Format: <type> <price> <amount>");
    return;
  }

  const order = {
    userName: os.userInfo().username,
    type: type.toLowerCase(),
    price: parseFloat(price),
    amount: parseInt(amount),
  };

  addOrderToClient(order);
}

function startOrderLoop() {
  console.log("Enter orders in the format: <type> <price> <amount>");
  console.log("Type 'exit' to stop.");

  rl.on("line", (input) => {
    if (input.trim().toLowerCase() === "exit") {
      console.log("Exiting...");
      console.log("Final Orders:", orders);
      rl.close();
      process.exit(0); // Exit the program
    }

    processOrder(input);
  });
}

// Start the loop
startOrderLoop();
