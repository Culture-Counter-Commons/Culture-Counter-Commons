// 
// VARIABLES
// 

// place order button
const placeOrderBtn = document.querySelector('.save-purchase-order-w3');

// close X element 
const closeBtn = document.querySelector('.po-close');

// 
// FUNCTIONS
// 
function addPageRedirect() {

    var delay = 4000; // time in milliseconds

    setTimeout(function () {

        window.location = "https://culturecountercommons.com/collections/market-auto-online";

    }, delay);

}

function createAnchor() {

    // time in milliseconds
    var delay = 2000;

    setTimeout(function () {

        // close X element that will be wrapped
        const closeBtn = document.querySelector('.po-close');

        // create closeAnchor container
        var closeAnchor = document.createElement('a');

        // set the closeAnchor elements href attribute
        closeAnchor.setAttribute('href', '/cart/clear');
        closeAnchor.setAttribute('class', 'close-anchor');
        
        // insert closeAnchor before el in the DOM tree
        closeBtn.parentNode.insertBefore(closeAnchor, closeBtn);

        // move el into closeAnchor
        closeAnchor.appendChild(closeBtn);

        closeBtn.addEventListener('click', () => addPageRedirect());

    }, delay);

}

placeOrderBtn.addEventListener('click', () => createAnchor());


function windowLocation(event) {
    
    event.preventDefault();

    var newCloseAnchor = document.querySelector('.close-anchor');

    newCloseAnchor.setAttribute('onclick', `javascript:window.location='http://google.com'`);

}

var poSubmitBtn = document.getElementById('po-submit');

poSubmitBtn.addEventListener('click', () => windowLocation());