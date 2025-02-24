import { createHTML, clearNode } from "./utils.mjs";
import { API_URL, CURRENCY } from "./constants.mjs";
import { addToCart } from "./cart.mjs";

const containerElement = document.querySelector("#js-products");
const sortByElement = document.querySelector("#js-sort-by");
let products = [];

// CHECK IF containerElement EXIST IN THE DOM
if (!containerElement || !sortByElement) {
    alert("Required elements are missing on this page. Please try again later.");
} else {
    setup();
}

// FUNCTION - INITIALIZE THE APPLICATION SETUP
function setup() {
    getProducts();
}

// FUNCTION - FETCHES AND DISPLAYS PRODUCTS
async function getProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            alert("There was an error loading products. Please try again later.");
        }
        const { data } = await response.json();
        products = data;

        products.sort((a, b) => a.price - b.price); // default sorting: low to high
        renderProducts(products);
    } catch (error) {
        alert("There was an error loading products. Please try again later.", error?.message);
    }
}

// FUNCTION - RENDER PRODUCTS
function renderProducts(items) {
    clearNode(containerElement);

    items.forEach(item => {
        const template = itemTemplate({
            title: item.title,
            imageURL: item.image?.url,
            imageAlt: item.image?.alt || "Product image",
            price: item.price,
            id: item.id,
        });

        const newElement = createHTML(template);
        containerElement.append(newElement);

        const btn = newElement.querySelector("button");
        btn.addEventListener("click", () => {
            addToCart({
                id: item.id,
                title: item.title,
                imageUrl: item.image?.url,
                price: item.price
            });
        });
    });
}

// FUNCTION - CREATING TEMPLATES FOR THE ITEMS
function itemTemplate({ title, imageURL, imageAlt, price, id }) {
    return `
    <article class="item-details">
        <div class="item-image">
            <img src="${imageURL}" alt="${imageAlt}">
        </div>

        <div class="item-info">
            <h4 class="item-title">${title}</h4>
            <div class="item-price">${price} ${CURRENCY}</div>

            <div class="item-actions">
                <a href="/src/item.html?id=${id}" class="view-details-btn">View Details</a>
                <button class="add-to-cart-btn">
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
        </div>
    </article>`;
}

// EVENT LISTENER - SORTING PRODUCTS
sortByElement.addEventListener("change", event => {
    const val = event.target.value;

    switch (val) {
        case "asc": // sorting products by price => low to high
            products.sort((a, b) => a.price - b.price);
            break;
        case "desc": // sorting products by price => high to low
            products.sort((a, b) => b.price - a.price);
            break;
        case "rec": // sorting products by recommendations => true to false
            products.sort((a, b) => b.favorite - a.favorite);
            break;
        default:
            console.warn(`Unknown sort option: ${val}`);
    }

    renderProducts(products);
});
