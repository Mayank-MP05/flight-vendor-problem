const vendorsDB = require("../database/vendors.model");
const { getRandomInt } = require("../utils");
const { printVendorWiseLatency, printLine } = require("../utils/print-vendor-wise-latency");

const getVendors = async (req, res, next) => {
    const thresholdAPILatency = 100;
    console.log("GET /get-flights @", new Date().toLocaleTimeString());

    console.log(`- Threshold API Latency : ${thresholdAPILatency}ms`)
    const startTimer = new Date().getTime();
    printLine();
    printVendorWiseLatency(vendorsDB);
    printLine();

    try {
        console.log(`** Parallel call to vendors API`)

        // DOCS: STEP 1: Prepare Vendor API Promises to fetch data from all vendors only execute if latency is less than threshold
        let getVendorsFlightsPromisesArr = vendorsDB.map(singleVendor => {
            if (singleVendor.vendorLatency < thresholdAPILatency) {
                return getSingleVendorFlights({
                    vendorName: singleVendor.vendorName,
                    vendorLatency: singleVendor.vendorLatency
                })
            }
        })
        printLine();

        // DOCS: Remove nulls and undefined for non-eligible vendors
        getVendorsFlightsPromisesArr = getVendorsFlightsPromisesArr.filter(singleVendor => singleVendor != undefined)

        const vendorResponseBoolArr = getVendorsFlightsPromisesArr.map(singleVendor => false)

        // const vendorsFlightData = await Promise.all(getVendorsFlightsPromisesArr)

        const flattenedVendorsFlightData = []

        fetchVendorsDataPromiseExecutors({ getVendorsFlightsPromisesArr, flattenedVendorsFlightData });

        // DOCS: STEP 3: Flatten the array coming from all vendors within threshold latency
        setTimeout(() => {
            // DOCS: STEP 4: Sort the outputs based on price and return
            flattenedVendorsFlightData.sort((flightOne, flightTwo) => {
                return flightOne.flightPrice - flightTwo.flightPrice
            })

            // DOCS: STEP 5: Print total time taken by the API
            const endTimer = new Date().getTime();
            const timeTaken = endTimer - startTimer;
            console.log("Net API Response Time : ", timeTaken);
            console.log(`** Response sent to Client`)
            printLine();

            // DOCS: STEP 6: Return the sorted data
            res.status(200).json({ vendors: flattenedVendorsFlightData })
        }, thresholdAPILatency);
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
    console.log(`Invoked getSingleVendorFlights: ${vendorName}`);
    return new Promise((resolve, reject) => setTimeout(() => {
        resolve(vendorsDB.filter(vendor => vendor.vendorName === vendorName)[0].flightsArr)
    }, vendorLatency));
}

/**
 * @description: Execute all promises in parallel
 */
const fetchVendorsDataPromiseExecutors = ({ getVendorsFlightsPromisesArr, flattenedVendorsFlightData }) => {
    // DOCS: STEP 2: Execute all promises in parallel
    // console.log(`vendorResponseBoolArr @${i}s: `, vendorResponseBoolArr);
    getVendorsFlightsPromisesArr.forEach((singleVendorPromise, idx) => {
        try {
            singleVendorPromise.then((vendorData) => {
                console.log("-> Single Vendor Response from: ", vendorData[0].airlinesName + " @" + new Date().toLocaleTimeString() + " with latency " + vendorData[0].airlineAPILatency + "ms");
                vendorResponseBoolArr[idx] = true;
                flattenedVendorsFlightData.push(...vendorData)
            }).catch((error) => {
                // console.log("vendorsFlightData PROMISE ERROR: ", error);
            })
        } catch (error) {
            console.log("vendorsFlightData PROMISE ERROR: ", error);
        }
    })
}

module.exports = { getVendors }