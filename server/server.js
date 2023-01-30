const express = require('express')
const { getAllFlightsFromVendors } = require('./controllers/vendor.controller')
const app = express()
const PORT = 5000

app.get('/', (req, res) => {
    res.send('Hello Boiii, Welcome to Flights World!')
})

app.get('/get-flights', getAllFlightsFromVendors)


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})