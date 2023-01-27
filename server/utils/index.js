const { uuid } = require('uuidv4');
const airlineBookingLinksArr = require('./flights-companies-links');

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Function to delay execution of js function by delayed ms sec
 * @param {*} delayInMs 
 * @param {*} fn 
 * @param  {...any} args 
 * @returns 
 */
async function sleep(delayInMs = 3000, fn, ...args) {
    await timeout(delayInMs);
    return fn(...args);
}

/**
 * Insert vendor name in flights object for each vendor
 * @param {object} vendorObj 
 * @returns 
 */
const insertVendorNameInFlightsObj = (vendorObj) => {
    // DOCS: Get Random Id
    const flightId = uuid();

    // DOCS: Get Random Booking Link
    const airlineLinksArrLen = airlineBookingLinksArr.length - 1;
    const getRandomBookingLink = airlineBookingLinksArr[getRandomInt(0, airlineLinksArrLen)]
    return {
        ...vendorObj, flightsArr: vendorObj.flightsArr.map(singleFlightObj => ({
            ...singleFlightObj,
            airlinesName: vendorObj.vendorName,
            airlineAPILatency: vendorObj.vendorLatency,
            flightId: flightId,
            bookingLink: `https://www.${getRandomBookingLink}/flightId=${flightId}`
        }))
    }
}

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    sleep,
    timeout,
    insertVendorNameInFlightsObj,
    getRandomInt
}