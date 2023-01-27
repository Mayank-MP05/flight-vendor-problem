import { sleep } from "../utils"

const vendorsDB = [
    {
        vendorName: "AIR_ASIA",
        vendorLatency: 1000,
    },
    {
        vendorName: "AIR_INDIA",
        vendorLatency: 2000,
    },
    {
        vendorName: "GO_FIRST",
        vendorLatency: 5000,
    },
    {
        vendorName: "SPICE_JET",
        vendorLatency: 3000,
    }, {
        vendorName: "VISTARA",
        vendorLatency: 1000,
    }
]

export const getVendors = async (req, res) => {
    // const {  } = req.body
    const thresholdAPILatency = 3000;

    try {
        const vendors = await Vendor.find()
        res.status(200).json(vendors)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getSingleVendorFlights = async ({ vendorName, vendorLatency }) => {
    const vendorFlights = []
    for (const vendor of vendorLatencyArr) {
        const { vendorName, latency } = vendor
        const vendorFlight = await sleep(latency, getVendorFlights, vendorName)
        vendorFlights.push(vendorFlight)
    }
    return vendorFlights
}
