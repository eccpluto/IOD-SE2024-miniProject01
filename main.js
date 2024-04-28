/**
 * This is the supporting code for the cryptfolio web application.
 * 
 * Do note use this file firectly, launch the ./app.hmtl which will call functions
 * in this file as required. 
 * 
 * Copywrite eccpluto
 */

// initialise Local Data
let state = {
    location: "",
    coinsLoaded: false,
}

// for storing popular coins
let popularCoins = [];
// build a cache of all coins in the background
let coins = [];

// object which describes portfolio
let portfolio = {
    riskProfile: {
        high: false,
        low: false,
        balanced: false,
    },
    coins: [],
    weightings: [], // weightings.length == coins.length, give a value 1 - 100 for capital investment in each      
}

// populate the home view by default
document.addEventListener("DOMContentLoaded", function () {
    // only do this if the user is on the home page, as will probably try doing this everytime - unless only when page is refreshed? TO INVESTIGATE
    renderHomeView();
    fetchAllCoins();
})


// manipulate different views dynamically
// main/landing page
function renderHomeView() {
    if (state.location == 'home') { return }
    // start async function which may call external api
    // promise some data to be rendered in the future by renderCoinCards()
    clearView();
    populateCoinsPromise()
        .then(renderCoinCardCarousel);

    // populate the home view
    const templateHomeView = document.getElementById('templateHomeView').content.cloneNode(true);
    // const clon = template.content.cloneNode(true);

    // should make a promise here to populate the coin cards when possible
    // templateHomeView.getElementById('templateHomeView').innerHTML;
    const target = document.getElementById('mainContainer')
    target.appendChild(templateHomeView);
    state.location = 'home';
}

// page for customising porfolio preferences
function renderPreferencesView() {
    if (state.location == 'preferences') { return };
    alert('Not yet implemented!');
    state.location = 'preferences';
}

// page for displaying portfolio options
function renderPortfolioView(withSuggestion = false) {
    if (state.location == 'portfolio') { return };
    if (withSuggestion) {
        // just get a balanced risk portfiolio for now
        portfolio.riskProfile.balanced = true;
    }

    if (generatePortfolio()) {
        clearView();
        const templatePortfolioView = document.getElementById('templatePortfolioView').content.cloneNode(true);

        // add portfolio coins to template
        portfolio.coins.forEach((coin) => {
            templatePortfolioView.querySelector('.portfolio-coins').appendChild(renderCoinCard(coin));
        })


        const target = document.getElementById('mainContainer');
        target.appendChild(templatePortfolioView);
        state.location = 'portfolio';
    }
}

function showAbout() {
    alert('Cryptfolio helps you choose cryptocurrency investments.')
}

/**
 * @description This just generates random fake data for now
 */
function generatePortfolio() {
    if (!state.coinsLoaded) {
        alert("Coin database not yet loaded, please try again shortly.");
        return false;
    }
    portfolio.weightings = [];
    portfolio.coins = [];

    let weighting1 = getRandomWeighting(100);
    let weighting2 = getRandomWeighting(100 - weighting1);

    portfolio.weightings.push(weighting1);
    portfolio.weightings.push(weighting2);
    portfolio.weightings.push(100 - (weighting1 + weighting2));

    // use the same weightings to select random coins, 1 less as they are zero-indexed
    portfolio.coins.push(coins.data[weighting1 - 1]);
    portfolio.coins.push(coins.data[weighting2 - 1]);
    portfolio.coins.push(coins.data[99 - (weighting1 + weighting2)]);

    return true;
}

function getRandomWeighting(maxValue) {
    return Math.floor((((Math.random() * 100) + 1) % maxValue));
}

// page for displaying details about a selected coin
function renderCoinDetailsModalView() { }

function fetchAllCoins() {
    fetch('https://api.coincap.io/v2/assets')
        .then((response) => response.json())
        .then((json) => { coins = json; state.coinsLoaded = true })
}

// create coin cards
function renderCoinCardCarousel() {
    let active = true;
    popularCoins.data.forEach((coin) => {
        const template = renderCoinCard(coin);
        appendCarouselElement(template, '.carousel-inner', active);
        if (active) { active = false }
    })
    // make carousel slides group 3 elements together
    groupCarouselItems(3);
}

function search(query) {
    query = query.toUpperCase();
    const found = coins.data.filter((coin) => {
        return (coin.name.toUpperCase() === query) || (coin.id.toUpperCase() === query) || (coin.symbol.toUpperCase() === query)
    })
    if(found.length = 0 ) {
        alert(`Not found!`);
    }
}

function renderCoinCard(coin) {
    let template = document.getElementById('templateCoinCard').content.cloneNode(true);
    template.querySelector('.text-center').innerText = coin.symbol;
    template.querySelector('.card-title').innerText = coin.name;

    // colourise percentage price fluctuctuations to visually indicate trends
    const attrClass = document.createAttribute('class');
    if (coin.changePercent24Hr > 0) {
        attrClass.value = 'card-text text-success';
    } else {
        attrClass.value = 'card-text text-danger';
    }

    template.querySelector('.card-text').innerText = coin.changePercent24Hr.substring(0, 5);
    template.querySelector('.card-text').setAttributeNode(attrClass);
    template.querySelector('a').href = coin.explorer;
    return template;
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
        for (let i = 0; i < groupNumber - 1; i++) {
            if (!next) {
                next = carouselItems[0];
            }
            let cloneChild = next.cloneNode(true);
            item.appendChild(cloneChild.children[0]);
            next = next.nextElementSibling;
        }
    })
}

/**
 * @description Utility to clear the main container that changes depending on which view is rendered.
 */
function clearView() {
    removeChildren('#mainContainer');
}

/**
 * @param {String} parent This is the container / parent that will have its childeren removed. 
 */
function removeChildren(parent) {
    let parentNode = document.querySelector(parent);
    while (parentNode.hasChildNodes()) {
        parentNode.removeChild(parentNode.firstChild);
    }
}

// stub for getting details about a specific coin - from search
function getCoinDetails(coin) {

}