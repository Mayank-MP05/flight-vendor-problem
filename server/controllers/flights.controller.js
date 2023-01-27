const getFlights = async (req, res) => {
    try {
        const flights = await Flight.find()
        res.status(200).json(flights)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

module.exports = { getFlights }