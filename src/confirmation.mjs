import { CURRENCY } from "./constants.mjs";
import { clearNode } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const orderItemsElement = document.querySelector("#js-order-items");
  const orderTotalElement = document.querySelector("#js-order-total");
  const orderIdElement = document.querySelector(".order-id strong");
  const backHomeButton = document.querySelector(".back-home");
  const trackOrderButton = document.querySelector(".track-order");

  // Retrieve cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if (!orderItemsElement || !orderTotalElement || !orderIdElement) {
    alert("Order confirmation elements are missing. Please try again later.");
    return;
  }

  // Clear order items container
  clearNode(orderItemsElement);

  if (cartItems.length === 0) {
    orderItemsElement.innerHTML = "<p>Your cart is empty.</p>";
    orderTotalElement.textContent = `Total: ${CURRENCY} 0.00`;
    return;
  }

  let total = 0;

  // Group items by their unique id
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = { ...item, quantity: 0 };
    }
    acc[item.id].quantity += item.quantity;
    return acc;
  }, {});

  // Render cart items and calculate total
  Object.values(groupedItems).forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("order-item");
    itemElement.innerHTML = `
      <div class="order-item-details">
        <span>${item.title}</span>
        <span>${item.quantity} x ${CURRENCY} ${item.price.toFixed(2)}</span>
      </div>
      <div class="order-item-price">${CURRENCY} ${(item.quantity * item.price).toFixed(2)}</div>
    `;
    orderItemsElement.appendChild(itemElement);
    total += item.quantity * item.price;
  });

  // Update the total price
  orderTotalElement.textContent = `Total: ${CURRENCY} ${total.toFixed(2)}`;

  // Set a mock order ID (you could integrate this with an actual order management system)
  orderIdElement.textContent = `#${Math.floor(Math.random() * 1000000)}`;

  // Event listeners for buttons
  backHomeButton.addEventListener("click", () => {
    window.location.href = "index.html"; // Redirect to homepage
  });

  trackOrderButton.addEventListener("click", () => {
    alert("Tracking your order... (this feature is under development)"); // Placeholder for order tracking
  });
});
