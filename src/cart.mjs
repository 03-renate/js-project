import { createHTML, clearNode } from "./utils.mjs";
import { CURRENCY } from "./constants.mjs";

// Elements for the cart
const cartToggleIcon = document.querySelector("#js-cart-icon");
const cartSidebar = document.querySelector("#cart-sidebar");
const closeCartButton = document.querySelector("#close-cart");
const cartItemsElement = document.querySelector(".cart-items");
const cartTotalElement = document.querySelector(".cart-total");
const cartItemCountElement = document.querySelector(".cart-item-count");

// Cart state
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// Initial setup
setup();

// FUNCTION - INITIALIZE THE APPLICATION SETUP
function setup() {
  if (
    !cartToggleIcon ||
    !cartSidebar ||
    !closeCartButton ||
    !cartItemsElement ||
    !cartTotalElement ||
    !cartItemCountElement
  ) {
    console.error("JS cannot run.");
    return;
  }

  // Event listeners for opening and closing the cart sidebar
  cartToggleIcon.addEventListener("click", () => {
    cartSidebar.classList.add("open");
  });

  closeCartButton.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
  });

  updateCart();
}

// FUNCTION - ADD TO CART
export function addToCart({ id = "", imageUrl, price, title }) {
  const existingItem = cartItems.find((item) => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      id,
      imageUrl,
      title,
      price,
      quantity: 1, // Set initial quantity
    });
  }

  saveCart();
  updateCart();
}

// FUNCTION - UPDATE CART
function updateCart() {
  clearNode(cartItemsElement);

  let total = 0;
  let totalItems = 0;

  cartItems.forEach((item) => {
    const template = cartItemTemplate({
      imgUrl: item.imageUrl,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
    });

    const productItemElement = createHTML(template);
    cartItemsElement.appendChild(productItemElement);

    total += item.price * item.quantity;
    totalItems += item.quantity;

    // Add event listeners for the buttons
    const addItemBtn = productItemElement.querySelector(".add-item-btn");
    const removeItemBtn = productItemElement.querySelector(".remove-item-btn");

    addItemBtn.addEventListener("click", () => incrementItemQuantity(item.id));
    removeItemBtn.addEventListener("click", () => decrementItemQuantity(item.id));
  });

  // Update cart total and item count
  cartTotalElement.textContent = `Total: ${CURRENCY} ${total.toFixed(2)}`;
  cartItemCountElement.textContent = totalItems;
}

// FUNCTION - INCREMENT ITEM QUANTITY
function incrementItemQuantity(id) {
  const item = cartItems.find((item) => item.id === id);
  if (item) {
    item.quantity += 1;
    saveCart();
    updateCart();
  }
}

// FUNCTION - DECREMENT ITEM QUANTITY
function decrementItemQuantity(id) {
  const itemIndex = cartItems.findIndex((item) => item.id === id);
  if (itemIndex !== -1) {
    const item = cartItems[itemIndex];
    item.quantity -= 1;

    if (item.quantity === 0) {
      cartItems.splice(itemIndex, 1);
    }

    saveCart();
    updateCart();
  }
}

// FUNCTION - CART ITEM TEMPLATE
function cartItemTemplate({ imgUrl = "", title = "unknown", price = 0, quantity = 1 }) {
  return `
    <div class="cart-item">
        <img src="${imgUrl}" alt="${title}" class="cart-item-image" />
        <div class="cart-item-details">
            <h3 class="cart-item-title">${title}</h3>
            <p>${quantity} x ${CURRENCY} ${price.toFixed(2)}</p>
        </div>
        <div class="cart-item-actions">
            <button class="add-item-btn">+</button>
            <button class="remove-item-btn">-</button>
        </div>
    </div>`;
}

// FUNCTION - SAVE CART TO LOCALSTORAGE
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cartItems));
}
