import { createHTML, clearNode } from "./utils.mjs";
import { API_URL, CURRENCY } from "./constants.mjs";

const containerElement = document.querySelector("#js-products");
const sortByElement = document.querySelector("#js-sort-by");
let products = [];

// CHECK IF containerElement EXIST IN THE DOM
if (!containerElement || !sortByElement) { //if these elements do not exist in the DOM, it will bum out
    console.error("JS cannot run");
} else {
    setup(); // if element exists, call SETUP() to proceed with initialization
}

// FUNCTION - INITIALIZE THE APPLICATION SETUP
function setup() {
    getProducts(); // calling GET PRODUCTS()
}

// FUNCTION - FETCHES AND DISPLAYS PRODUCTS
async function getProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const { data } = await response.json();
        products = data;

        products.sort((a, b) => a.price - b.price); // default sorting: low to high
        renderProducts(products);
    } catch (error) {
        console.error("Failure", error?.message);
    }
}

// FUNCTION - RENDER PRODUCTS
function renderProducts(items) {
    clearNode(containerElement);

    items.forEach(item => {
        const template = itemTemplate({
            title: item.title,
            imageURL: item.image?.url,
            imageAlt: item.image?.alt,
            description: item.description,
            price: item.price,
            id: item.id,
        });

        const newElement = createHTML(template);
        containerElement.append(newElement);
    });
}

// FUNCTION - CREATING TEMPLATES FOR THE ITEMS
function itemTemplate({ title, imageURL, imageAlt, description, price, id }) {
    return `
    <article class="item-details">
        <div class="item-image">
            <img src="${imageURL}" alt="${imageAlt}">
        </div>
        <div class="item-info">
            <h4 class="item-title">${title}</h4>
            <p class="item-description">${description}</p>
            <div class="item-price">${price} ${CURRENCY}</div>
            <div class="item-actions" id="js-addToCart-btn-${id}">
                <button>Add to Cart</button>
            </div>
        </div>
    </article>`;
}

// EVENT LISTENER - SORTING PRODUCTS
sortByElement.addEventListener("change", event => {
    const val = event.target.value;

    switch (val) {
        case "asc": //sorting products by price => high to low
            products.sort((a, b) => a.price - b.price);
            break;
        case "desc": //sorting products by price => low to high
            products.sort((a, b) => b.price - a.price);
            break;
        case "rec": //sorting products by recommendations => true to false
            products.sort((a, b) => b.favorite - a.favorite); // 
            break;
        default:
            console.warn(`Unknown sort option: ${val}`);
    }

    renderProducts(products);
});