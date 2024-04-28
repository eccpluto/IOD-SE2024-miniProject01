/**
 * This is the supporting code for the cryptfolio web application.
 * 
 * Do note use this file firectly, launch the ./app.hmtl which will call functions
 * in this file as required. 
 * 
 * Copywrite eccpluto
 */

// initialise Local Data

// for storing popular coins
let popularCoins = [];

// populate the home view by default
document.addEventListener("DOMContentLoaded", function () {
    // only do this if the user is on the home page, as will probably try doing this everytime - unless only when page is refreshed? TO INVESTIGATE
    renderHomeView();
})

// manipulate different views dynamically
// main/landing page
function renderHomeView() {
    // start async function which may call external api
    // promise some data to be rendered in the future by renderCoinCards()
    populateCoinsPromise()
        .then(renderCoinCards);

    // populate the home view
    const templateHomeView = document.getElementById('templateHomeView').content.cloneNode(true);
    // const clon = template.content.cloneNode(true);

    // should make a promise here to populate the coin cards when possible
    // templateHomeView.getElementById('templateHomeView').innerHTML;
    const target = document.getElementById('mainContainer')
    target.appendChild(templateHomeView);
}

// page for customising porfolio preferences
function renderPreferencesView() { }
// page for displaying portfolio options
function renderPortfolioView() { }
// page for displaying details about a selected coin
function renderCoinDetailsModalView() { }

// create coin cards
function renderCoinCards() {
    let active = true;
    popularCoins.data.forEach((coin) => {
        const template = document.getElementById('templateCoinCard').content.cloneNode(true);
        template.querySelector('.text-center').innerText = coin.symbol;
        template.querySelector('.card-title').innerText = coin.name;
        template.querySelector('a').href = coin.explorer;

        appendCarouselElement(template, '.carousel-inner', active);
        if (active) { active = false }
    })
    // make carousel slides group 3 elements together
    groupCarouselItems(3);
}

// utilities and core functions
// asynchronously populate popular coins
function populateCoinsPromise() {
    return new Promise((resolve) => {
        // exit early if we already have cached the popular coins
        if (popularCoins.length != 0) { resolve() };
        fetch('https://api.coincap.io/v2/assets?limit=10')
            .then((response) => response.json())
            .then((json) => { popularCoins = json; resolve() })
    })
}

/**
 * 
 * @description Highly specific utility function for wrapping a card and appending it the carousel element
 * with class '.carousel-inner'. It also wraps the card element with HTML needed to place it into a functioning
 * carousel which displays 3 elements on each carousel slide.
 * @param {String} element to be appended to the target as a child.
 * @param {String} target element to append the element too, with some wrapping.
 * @param {Boolean} active set true for some carousel item to initialise the bs component,
 * this should only be done for one item in the carousel.
 */
function appendCarouselElement(element, target, active = false) {
    const targetElement = document.querySelector(target);

    // wrap the element in a carousel item div
    const subTarget = document.createElement('div'); // need to dynamically set class for this
    const attrClass = document.createAttribute('class');
    if (active) { attrClass.value = 'carousel-item active' }
    else { attrClass.value = 'carousel-item' }
    subTarget.setAttributeNode(attrClass);
    subTarget.appendChild(element);

    // append the wrapped element to the target as a child
    targetElement.appendChild(subTarget);
}

/**
 * 
 * @description Will apply a gruuping to a set of ungrouped carouset items.
 * @param {Number} groupNumber The number of items to be grouped together on a single slide.
 */
function groupCarouselItems(groupNumber) {
    let carouselItems = document.querySelectorAll('.carousel-item');
    carouselItems.forEach((item) => {
        let next = item.nextElementSibling;
        for (let i = 0; i < groupNumber-1; i++) {
            if (!next) {
                next = carouselItems[0];
            }
            let cloneChild=next.cloneNode(true);
            item.appendChild(cloneChild.children[0]);
            next = next.nextElementSibling;
        }
    })
}

// stub for getting details about a specific coin - from search
function getCoinDetails(coin) {

}