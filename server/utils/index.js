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
    return {
        ...vendorObj, flightsArr: vendorObj.flightsArr.map(singleFlightObj => ({
            ...singleFlightObj,
            airlinesName: vendorObj.vendorName,
            airlineAPILatency: vendorObj.vendorLatency
        }))
    }
}

module.exports = {
    sleep,
    timeout,
    insertVendorNameInFlightsObj
}