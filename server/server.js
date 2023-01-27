const express = require('express')
const { getVendors } = require('./controllers/vendor.controller')
const app = express()
const PORT = 5000

app.get('/', (req, res) => {
    res.send('Hello Boiii, Welcome to Flights World!')
})

app.post('/get-flights', getVendors)


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})