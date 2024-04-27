/**
 * This is the supporting code for the cryptfolio web application.
 * 
 * Do note use this file firectly, launch the ./app.hmtl which will call functions
 * in this file as required. 
 * 
 * Copywrite eccpluto
 */

// initialise Local Data

// for caching popular coins
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
function renferPreferencesView() { }
// page for displaying portfolio options
function renderPortfolioView() { }
// page for displaying details about a selected coin
function renderCoinDetailsModalView() { }

// create coin cards
function renderCoinCards() {
    const template = document.getElementById('templateCoinCard').content.cloneNode(true);
    const target = document.getElementById('mainContainer');
    target.appendChild(template);
}


// utilities and core functions

// asynchronously populate popular coins
function populateCoinsPromise() {
    return new Promise((resolve) => {
        // should cache somewhere here
        fetch('https://api.coincap.io/v2/assets')
            .then((response) => response.json())
            .then((json) => { console.log(json); resolve() })
    })
}

// stub for getting details about a specific security
function getCoinDetails(coin) {

}