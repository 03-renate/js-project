const API_URL = "https://v2.api.noroff.dev/rainy-days";
const containerElement = document.querySelector("#js-products")
const CURRENCY = "NOK"

if (!containerElement) { //if these elements do not exist in the DOM, it will bum out
    console.error("JS cannot run");
} else {
    setup();
}

function setup(){
    getProducts(); //calling GET PRODUCTS function
}

//GET PRODUCTS
async function getProducts() {
    try{
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const {data} = await response.json();
        

        data.forEach(item => {
            const template = itemTemplate({
            title: item.title,
            imageURL: item.image?.url, //? > object is null > expression evaluates to undefined instead of error
            imageAlt: item.image?.alt, //? > object is not null -> proceeds to access the url property
            description: item.description, 
            price: item.price, 
            id: item.id,
            });
        
        const newElement = createHTML(template)
        containerElement.append(newElement)
        });
    } catch (error){
        console.error("Failure", error?.message);
    }
}


//FUNCTION - CREATING TEMPLATES FOR THE ITEMS
function itemTemplate({
    title, imageURL, imageAlt, description, price, id
}) {
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
    </article>`
}


//FUNCTION - 
function createHTML(template){
    const parser = new DOMParser();
    const parsedDocument = parser.parseFromString(template, "text/html");
    return parsedDocument.body.firstChild;
}