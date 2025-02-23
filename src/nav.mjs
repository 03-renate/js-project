document.addEventListener("DOMContentLoaded", () => {
const cartIcon = document.querySelector("#cart-icon");
const cartSidebar = document.querySelector("#cart-sidebar");
const closeCartButton = document.querySelector("#close-cart");
const cartItemCount = document.querySelector(".cart-item-count");
const cartItemsContainer = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const checkoutButton = document.querySelector("#checkout-btn");

let cart = [];

// Toggle cart sidebar
cartIcon.addEventListener("click", () => {
    cartSidebar.classList.add("open");
});

closeCartButton.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
});

// Function to update cart display
function updateCartDisplay() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    } else {
    cart.forEach((item, index) => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
        <p>${item.name} - $${item.price.toFixed(2)}</p>
        <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
        total += item.price;
    });
    }

    cartItemCount.textContent = cart.length;
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Add item to cart
function addItemToCart(name, price) {
    cart.push({ name, price });
    updateCartDisplay();
}

// Remove item from cart
cartItemsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
    const index = e.target.getAttribute("data-index");
    cart.splice(index, 1);
    updateCartDisplay();
    }
});

// Simulate adding an item to the cart (example)
addItemToCart("Jacket A", 49.99);
addItemToCart("Jacket B", 59.99);

// Checkout button event
checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
    alert("Your cart is empty!");
    } else {
    alert("Proceeding to checkout...");
    window.location.href = "checkout.html";
    }
});
});
