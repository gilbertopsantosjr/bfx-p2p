"use strict";
import { PeerRPCServer } from "grenache-nodejs-http";
import Link from "grenache-nodejs-link";
import OrderBook from "./orderbook.js";

export default class ExchangeServer {
  constructor(port) {
    this.port = port;
    this.orderbook = new OrderBook();
    this.service = null;
    this.setupGrenache();
  }

  setupGrenache() {
    // Setup link
    this.link = new Link({
      grape: "http://127.0.0.1:30001",
    });
    this.link.start();

    if (!this.link) {
      console.error("Failed to start link");
      process.exit(-1);
    }

    // Setup RPC server
    this.peerServer = new PeerRPCServer(this.link, {
      timeout: 300000,
    });
    this.peerServer.init();

    if (!this.peerServer) {
      console.error("Failed to start peerServer");
      process.exit(-1);
    }
  }

  async handleOrder(order, handler) {
    try {
      // Clients submit orders to their own instance of orderbook.
      const matches = this.orderbook.addOrder(order);
      // The order is distributed to other instances, too.
      // If a client's order matches with another order, any remainer is added to the orderbook, too.
      handler.reply(null, { matches });
    } catch (err) {
      handler.reply(err);
    }
  }

  start() {
    console.log("Starting server on port", this.port);
    this.service = this.peerServer.transport("server");
    this.service.listen(this.port, () => {
      console.log("Server listening on port", this.port);
    });
    this.timerId = setInterval(this.tick.bind(this), 1000);
    // Handle incoming orders
    this.service.on("request", (rid, key, payload, handler) => {
      console.log("Order received:", payload.order);
      if (payload.action === "submitOrder") {
        this.handleOrder(payload.order, handler);
      } else {
        handler.reply(new Error("Invalid action"));
      }
    });
  }

  tick() {
    this.link.announce("exchange", this.port, {});
  }

  stop() {
    clearInterval(this.timerId);
    this.service.close();
  }
}
