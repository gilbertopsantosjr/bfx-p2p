"use strict";
import { PeerRPCClient } from "grenache-nodejs-http";
import Link from "grenache-nodejs-link";

export default class ExchangeClient {
  constructor(port) {
    this.port = port;
    this.setupGrenache();
  }

  setupGrenache() {
    this.link = new Link({
      grape: `http://127.0.0.1:30001`,
    });
    this.link.start();

    if (!this.link) {
      console.error("Failed to start link client");
      process.exit(-1);
    }

    this.peer = new PeerRPCClient(this.link, {});
    this.peer.init();

    if (!this.peer) {
      console.error("Failed to start peer client");
      process.exit(-1);
    }
  }

  async submitOrder(order) {
    return new Promise((resolve, reject) => {
      this.peer.request(
        "exchange",
        {
          action: "submitOrder",
          order: order,
        },
        { timeout: 10000 },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }
}
