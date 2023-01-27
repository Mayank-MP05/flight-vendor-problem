export const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find()
        res.status(200).json(vendors)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const getAirAsiaFlights = async (req, res) => {
    try {
        const airAsiaFlights = await AirAsiaFlight.find()
        res.status(200).json(airAsiaFlights)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}