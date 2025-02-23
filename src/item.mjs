import { createHTML, clearNode } from "./utils.mjs";
import { API_URL, CURRENCY } from "./constants.mjs";

// Wait for the DOM to load before executing the code
document.addEventListener("DOMContentLoaded", async () => {
    const itemDetailsContainer = document.querySelector("#js-item-details");

    // If the container doesn't exist, stop the script
    if (!itemDetailsContainer) {
        console.error("JS cannot run: #js-item-details container not found");
        return;
    }

    // Parse the query string to get URL parameters
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const itemId = urlParams.get("id");

    if (!itemId) {
        console.error("No 'id' parameter found in the URL");
        itemDetailsContainer.innerHTML = "<p>Item ID is missing from the URL.</p>";
        return;
    }

    try {
        // Fetch item details and render them
        await fetchItemDetails(itemId, itemDetailsContainer);
    } catch (error) {
        console.error("Error fetching item details:", error);
        itemDetailsContainer.innerHTML = "<p>Failed to load item details. Please try again later.</p>";
    }
});

// Fetch item details based on itemId
async function fetchItemDetails(itemId, itemDetailsContainer) {
    let url = `${API_URL}?id=${itemId}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch item details: ${response.status}`);
        }

        const { data } = await response.json();

        if (!data || data.length === 0) {
            console.error("Item not found");
            itemDetailsContainer.innerHTML = "<p>Item not found. Please check the ID and try again.</p>";
            return;
        }

        const item = data[0]; // Assuming data is an array with the item object at index 0
        renderItemDetails(item, itemDetailsContainer);

    } catch (error) {
        console.error("Error fetching item details:", error);
        itemDetailsContainer.innerHTML = "<p>Failed to load item details. Please try again later.</p>";
    }
}

// Function to render item details
function renderItemDetails(item, itemDetailsContainer) {
    clearNode(itemDetailsContainer);

    const template = itemPage({
        title: item.title,
        imageURL: item.image?.url,
        imageAlt: item.image?.alt,
        price: item.price,
        id: item.id,
        gender: item.gender,
        info: item.description,
        size: item.sizes
    });

    const newElement = createHTML(template);
    itemDetailsContainer.append(newElement);
}

// Helper function to generate HTML for item page
function itemPage({ title, imageURL, imageAlt, price, id, gender, info, size }) {
    return `
    <article id="item-details-page" class="item-details">
        <div class="item-image">
            <img src="${imageURL}" alt="${imageAlt}">
        </div>
        <div class="item-info">
            <h4 class="item-title">${title} | ${gender}</h4>
            <div class="item-price">${price} ${CURRENCY}</div>
            <div class="item-info">${info}</div>
            <div class="item-size">${size}</div>
            <div class="item-actions">
                <button class="add-to-cart-btn" data-id="${id}">ADD TO CART</button>
            </div>
        </div>
    </article>`;
}
