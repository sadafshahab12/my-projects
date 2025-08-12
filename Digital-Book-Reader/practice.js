function orderPizza(options) {
  console.log(`Making a ${options.size} pizza with ${options.topping}`);
}
orderPizza({ size: "large", topping: " Cheese" });

function bookTrip(details) {
  console.log(
    `Booking a trip to ${details.destination} for ${details.duration} days.`
  );
}
bookTrip({ destination: "Hawaii", duration: 7 });

const pizzaOrder = {
  food: "Pizza",
  size: "Large",
  topping: "Cheese",
  drink: "Coke",
  quantity: 2,
};

function placeOrder(order) {
  console.log(
    `Place order for ${order.quantity} ${order.size} ${order.food} with ${order.topping} and ${order.drink}.`
  );
}

placeOrder(pizzaOrder);
