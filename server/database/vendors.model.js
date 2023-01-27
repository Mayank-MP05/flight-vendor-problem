
const { AIR_ASIA_FLIGHTS } = require("../vendors/air-asia")
const { AIR_INDIA_FLIGHTS } = require("../vendors/air-india")
const { GO_FIRST_FLIGHTS } = require("../vendors/go-first")
const { SPICEJET_FLIGHTS } = require("../vendors/spicejet")
const { VISTARA_FLIGHTS } = require("../vendors/vistara")
const { sleep, insertVendorNameInFlightsObj } = require("../utils")

let vendorsDB = [
    {
        vendorName: "AIR_ASIA",
        vendorLatency: 1000,
        flightsArr: AIR_ASIA_FLIGHTS
    },
    {
        vendorName: "AIR_INDIA",
        vendorLatency: 2000,
        flightsArr: AIR_INDIA_FLIGHTS
    },
    {
        vendorName: "GO_FIRST",
        vendorLatency: 5000,
        flightsArr: GO_FIRST_FLIGHTS
    },
    {
        vendorName: "SPICE_JET",
        vendorLatency: 3000,
        flightsArr: SPICEJET_FLIGHTS
    }, {
        vendorName: "VISTARA",
        vendorLatency: 1000,
        flightsArr: VISTARA_FLIGHTS
    }
]
vendorsDB = vendorsDB.map(vendor => insertVendorNameInFlightsObj(vendor))

module.exports = vendorsDB