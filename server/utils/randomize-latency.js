const { getRandomInt } = require(".")

const randomizeVendorLatency = (vendorDB) => {
    return vendorDB.map(vendor => ({
        ...vendor,
        vendorLatency: getRandomInt(0, 1000)
    }))
}

module.exports = { randomizeVendorLatency }