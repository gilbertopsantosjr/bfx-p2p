import ExchangeServer from "./exchange-server.js";
// Start a node server
const port = 1024 + Math.floor(Math.random() * 1000);
const node = new ExchangeServer(port);
node.start();
