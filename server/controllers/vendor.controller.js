let vendorsDB = require("../database/vendors.model");
const { getRandomInt, transformVendorObjAndFlights } = require("../utils");
const { printVendorWiseLatency, printLine, printNewRequest } = require("../utils/print-vendor-wise-latency");
const { randomizeVendorLatency } = require("../utils/randomize-latency");

const getAllFlightsFromVendors = async (req, res, next) => {
    const thresholdAPILatency = 300;
    let thresholdAPILatencyReached = false;
    printNewRequest();
    console.log("GET /get-flights @", new Date().toLocaleTimeString());

    console.log(`- Threshold API Latency : ${thresholdAPILatency}ms`)
    const startTimer = new Date().getTime();

    console.log("[INFO] Randomize DB latency done ...");
    // DOCS: STEP 0: Prepare DB with random latency and booking links
    vendorsDB = vendorsDB.map(vendor => transformVendorObjAndFlights(vendor))
    vendorsDB = randomizeVendorLatency(vendorsDB);

    printLine();
    printVendorWiseLatency(vendorsDB);
    printLine();

    try {
        console.log(`** Parallel call to vendors API`)

        // DOCS: STEP 1: Prepare Vendor API Promises to fetch data from all vendors only execute if latency is less than threshold
        let getVendorsFlightsPromisesArr = vendorsDB.map(singleVendor => {
            return getSingleVendorFlights(
                singleVendor.vendorName,
                singleVendor.vendorLatency
            )
        })
        printLine();

        // const vendorsFlightData = await Promise.all(getVendorsFlightsPromisesArr)

        const flattenedVendorsFlightData = []

        // DOCS: STEP 2: Execute all promises in parallel
        /**
         * @description: This is the main logic to execute all promises in parallel and wait for threshold latency
         */
        getVendorsFlightsPromisesArr.forEach((singleVendorPromise, idx) => {
            try {
                const singleVendorResponseStartTime = new Date().getTime();
                singleVendorPromise.then((vendorData) => {
                    if (thresholdAPILatencyReached) {
                        console.log("-> Kill promise ", vendorData[0].airlinesName);
                        return reject(new Error('** Server timeout at Query level'));
                    }
                    const singleVendorResponseEndTime = new Date().getTime();
                    const singleVendorLatency = singleVendorResponseEndTime - singleVendorResponseStartTime;
                    console.log("-> Response from: ", vendorData[0].airlinesName + ` @${new Date().toLocaleTimeString()}` + " || Network Latency " + singleVendorLatency + "ms");
                    // DOCS: STEP 3: Flatten the array coming from all vendors within threshold latency
                    flattenedVendorsFlightData.push(...vendorData)
                }).catch((error) => {
                    // console.log("vendorsFlightData PROMISE ERROR: ", error);
                }).finally(() => {
                })
            } catch (error) {
                console.log("vendorsFlightData PROMISE ERROR: ", error);
            }
        })

        setTimeout(() => {
            thresholdAPILatencyReached = true;

            // DOCS: STEP 4: Sort the outputs based on price and return
            flattenedVendorsFlightData.sort((flightOne, flightTwo) => {
                return flightOne.flightPrice - flightTwo.flightPrice
            })

            // DOCS: STEP 5: Print total time taken by the API
            const endTimer = new Date().getTime();
            const timeTaken = endTimer - startTimer;
            printLine();

            console.log(`Net API Response Time : ${timeTaken}ms`);
            console.log(`** Response sent to Client`)
            console.log('***************************************************')


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
const getSingleVendorFlights = async (vendorName, vendorLatency) => {
    console.log(`Invoked getSingleVendorFlights: ${vendorName}`);
    return new Promise((resolve, reject) => setTimeout(() => {
        resolve(vendorsDB.filter(vendor => vendor.vendorName === vendorName)[0].flightsArr)
    }, vendorLatency));
}

module.exports = { getAllFlightsFromVendors }