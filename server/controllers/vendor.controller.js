const vendorsDB = require("../database/vendors.model")

const getVendors = async (req, res, next) => {
    console.log("getVendors: ");
    const thresholdAPILatency = 4000;

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

        // DOCS: STEP 2: Execute all promises in parallel
        const vendorsFlightData = await Promise.all(getVendorsFlightsPromisesArr)

        // DOCS: STEP 3: Flatten the array coming from all vendors
        const flattenedVendorsFlightData = []
        vendorsFlightData.forEach(singleVendorFlights => {
            flattenedVendorsFlightData.push(...singleVendorFlights)
        })

        // DOCS: STEP 4: Sort the outputs based on price and return
        flattenedVendorsFlightData.sort((flightOne, flightTwo) => {
            return flightOne.flightPrice - flightTwo.flightPrice
        })

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
    console.log("getSingleVendorFlights: ");
    return new Promise((resolve, reject) => setTimeout(() => {
        resolve(vendorsDB.filter(vendor => vendor.vendorName === vendorName)[0].flightsArr)
    }, vendorLatency));
}


module.exports = { getVendors }