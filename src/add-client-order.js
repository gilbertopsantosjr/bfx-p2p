"use strict";

import ExchangeClient from "./exchange-client.js";

export function addOrderToClient(order) {
  //Each client will have its own instance of the orderbook.
  const client = new ExchangeClient();
  client
    .submitOrder(order)
    .then((result) => {
      console.log("Order submitted successfully:", result);
    })
    .catch((err) => {
      console.error("Connection error:", err);
    });
}
