import { createHTML, clearNode } from "./utils.mjs";
import { API_URL, CURRENCY } from "./constants.mjs";
import { addToCart } from "./cart.mjs";

const containerElement = document.querySelector("#js-item-details");
let id = null;

debugger;

setup();

function setup() {
    if (!containerElement) {
        console.error("JS cannot run");
        alert("An issue occurred with loading the page. Please try again later.");
    } else {
        const parameterString = window.location.search;
        const searchParameters = new URLSearchParams(parameterString);
        id = searchParameters.get("id");

        fetchItemDetails(id); // Fetch the item details for the given id
    }
}

// Fetch item details based on itemId
async function fetchItemDetails(itemId) {
    try {
        if (!itemId) {
            throw new Error(`Failed to fetch item id`);
        }


        const response = await fetch(`${API_URL}/${itemId}`);
        const { data } = await response.json();

        const template = detailsTemplate({
            title: data.title,
            imageURL: data.image?.url,
            imageAlt: data.image?.alt,
            price: data.price,
            id: data.id,
            description: data.description,
            sizes: data.sizes
        });

        const itemDetailElement = createHTML(template);
        clearNode(containerElement);
        containerElement.appendChild(itemDetailElement); // Display the product details in the container


        document.querySelector(".add-to-cart-btn").addEventListener("click", function() {
            addToCart({
                id: data.id,
                imageUrl: data.image?.url,
                price: data.price,
                title: data.title
            });
        });

    } catch (error) {
        console.error("Error fetching item details:", error?.message);
    }
}

// FUNCTION - CREATING THE TEMPLATE FOR THE SINGLE ITEM
function detailsTemplate({ title, imageURL, imageAlt, price, description, sizes }) {
    return `
    <article id="item-details-page" class="item-details">
        <div class="item-image">
            <img src="${imageURL}" alt="${imageAlt}">
        </div>

        <div class="item-info">
            <h4 class="item-title">${title}</h4>
            <div class="item-price">${price} ${CURRENCY}</div>
            <p class="item-description">${description}</p>

            <form action="">
                Size:
                <select id="size" name="size">
                ${sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                </select>
            </form>

            <div class="item-actions">
                <button class="add-to-cart-btn">
                    Add To Cart</i>
                </button>
            </div>
        </div>
    </article>`;
}