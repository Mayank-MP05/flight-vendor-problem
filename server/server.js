const express = require('express')
const app = express()
const PORT = 5000

app.get('/', (req, res) => {
    res.send('Hello Boiii, Welcome to Flights World!')
})

app.post('/get-flights', (req, res) => {
    setTimeout(() => {
        res.send('Hello Boiii, Welcome to Flights World!')
    }, 5000)
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})