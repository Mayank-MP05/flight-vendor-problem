const vendorsDB = require("../database/vendors.model");
const { getRandomInt } = require("../utils");

const getVendors = async (req, res, next) => {
    console.log("getVendors: ");
    const thresholdAPILatency = 4000;
    let i = 0;
    const startTimer = new Date().getTime();

    try {
        // DOCS: STEP 1: Prepare Vendor API Promises to fetch data from all vendors only execute if latency is less than threshold
        let getVendorsFlightsPromisesArr = vendorsDB.map(singleVendor => {
            if (singleVendor.vendorLatency < thresholdAPILatency) {
                return getSingleVendorFlights({
                    vendorName: singleVendor.vendorName,
                    vendorLatency: singleVendor.vendorLatency
                })
            }
        })

        // DOCS: Remove nulls and undefined for non-eligible vendors
        getVendorsFlightsPromisesArr = getVendorsFlightsPromisesArr.filter(singleVendor => singleVendor != undefined)

        const vendorResponseBoolArr = getVendorsFlightsPromisesArr.map(singleVendor => false)

        // DOCS: STEP 2: Execute all promises in parallel
        const vendorsFlightData = await Promise.all(getVendorsFlightsPromisesArr)


        const checkRecursive = () => {
            console.log(`vendorResponseBoolArr @${i}s: `, vendorResponseBoolArr);
            vendorsFlightData.forEach((singleVendor, idx) => {
                try {
                    singleVendor.then((data) => {
                        console.log("vendorsFlightData PROMISE DATA: ", data);
                        vendorResponseBoolArr[idx] = true;
                    }).catch((error) => {
                        console.log("vendorsFlightData PROMISE ERROR: ", error);
                    })
                } catch (error) {
                    console.log("vendorsFlightData PROMISE ERROR: ", error);
                }
            })
        }

        setTimeout(() => {
            checkRecursive();
        }, thresholdAPILatency);

        // DOCS: STEP 3: Flatten the array coming from all vendors
        const flattenedVendorsFlightData = []
        vendorsFlightData.forEach(singleVendorFlights => {
            flattenedVendorsFlightData.push(...singleVendorFlights)
        })

        // DOCS: STEP 4: Sort the outputs based on price and return
        flattenedVendorsFlightData.sort((flightOne, flightTwo) => {
            return flightOne.flightPrice - flightTwo.flightPrice
        })

        // DOCS: STEP : Stop the timer
        const endTimer = new Date().getTime();
        const timeTaken = endTimer - startTimer;
        console.log("timeTaken : ", timeTaken);

        // DOCS: STEP 5: Return the sorted data
        res.status(200).json({ vendors: flattenedVendorsFlightData })
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

/**
 * Get Promise for single vendor flights API based on Promise latency and vendor name (setTimeout)
 * @param {*} { vendorName, vendorLatency } 
 * @returns {Promise}
 */
const getSingleVendorFlights = async ({ vendorName, vendorLatency }) => {
    const randomLatency = getRandomInt(0, 10);
    console.log(`getSingleVendorFlights: ${vendorName} @ ${randomLatency}ms`);
    return new Promise((resolve, reject) => setTimeout(() => {
        resolve(vendorsDB.filter(vendor => vendor.vendorName === vendorName)[0].flightsArr)
    }, randomLatency * 1000));
}


module.exports = { getVendors }