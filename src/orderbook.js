export default class OrderBook {
  constructor() {}

  addOrder(order) {
    order.id = Date.now() + Math.random();
    order.amount = parseInt(order.amount);
    order.type = order.type.toLowerCase();
    order.userName = order.userName || "Unknown";
    order.price = parseFloat(order.price);
  }
}
