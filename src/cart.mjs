import { createHTML, clearNode } from "./utils.mjs";
import { CURRENCY } from "./constants.mjs";

const cartToggleIcon = document.querySelector("#js-cart-icon");
const cartSidebar = document.querySelector("#cart-sidebar");
const closeCartButton = document.querySelector("#close-cart");
const cartItemsElement = document.querySelector(".cart-items");
const cartTotalElement = document.querySelector(".cart-total");
const cartItemCountElement = document.querySelector(".cart-item-count");

const itemListCart = [];

setup();

// FUNCTION - INITIALIZE THE APPLICATION SETUP
function setup() {
    if (!cartToggleIcon || !cartSidebar || !closeCartButton || !cartItemsElement || !cartTotalElement || !cartItemCountElement) {
        console.error("JS cannot run.");
        return;
    }

    // Event listeners for opening and closing the cart sidebar
    cartToggleIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
      });
      
      closeCartButton.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
      });
}


//ADD TO CART
export function addToCart({ id = "", imageUrl, price, title }) {
    const existingItem = itemListCart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.price += price; // Add the unit price to the total price
    } else {
        itemListCart.push({
            id,
            imageUrl,
            title,
            price,
            quantity: 1, // Set initial quantity
        });
    }

    updateCart();
}


//UPDATE CART
function updateCart() {
    // Clear existing items in the cart
    clearNode(cartItemsElement);

    let total = 0;

    // Re-render all items in the cart
    itemListCart.forEach(item => {
        const template = cartItemTemplate({
            imgUrl: item.imageUrl,
            title: item.title,
            price: item.price,
            id: item.id,
        });

        const productItemElement = createHTML(template);
        cartItemsElement.appendChild(productItemElement);

        total += item.price;

        // Add event listeners for the buttons
        const addItemBtn = productItemElement.querySelector(".add-item-btn");
        const removeItemBtn = productItemElement.querySelector(".remove-item-btn");

        addItemBtn.addEventListener("click", () => {
            incrementItemQuantity(item.id);
        });

        removeItemBtn.addEventListener("click", () => {
            decrementItemQuantity(item.id);
        });
    });

    // Update the cart total and item count
    cartTotalElement.textContent = `Total: ${CURRENCY} ${total.toFixed(2)}`;
    cartItemCountElement.textContent = itemListCart.length;
}


//ADD ITEM QUANTITY TO CART
function incrementItemQuantity(id) {
    const item = itemListCart.find(item => item.id === id);
    if (item) {
        item.price += item.price / item.quantity; // Add the unit price
        item.quantity += 1;
        updateCart();
    }
}


//REMOVE ITEM FROM CART
function decrementItemQuantity(id) {
    const itemIndex = itemListCart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        const item = itemListCart[itemIndex];
        item.quantity -= 1;

        if (item.quantity === 0) {
            // Remove item from cart if quantity reaches 0
            itemListCart.splice(itemIndex, 1);
        } else {
            item.price -= item.price / item.quantity; // Subtract the unit price
        }

        updateCart();
    }
}


//CART ITEM TEMPLATE
function cartItemTemplate({ imgUrl = "", title = "unknown", price = 0 }) {
    return `
    <div class="cart-item">
        <img src="${imgUrl}" alt="" class="cart-item-image" />
        <div class="cart-item-details">
            <h3 class="cart-item-title">${title}</h3>
            <strong class="cart-item-price">${price} ${CURRENCY}</strong>
        </div>

        <div class="cart-item-actions">
            <button class="add-item-btn">+</button>
            <button class="remove-item-btn">-</button>
        </div>
    </div>`;
}
