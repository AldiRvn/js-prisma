import express from "express"

const port = 3000
const app = express()

app.get('/', (req, res) => {
    res.send('OK')
})

app.listen(port, () => {
    console.log(`http://0.0.0.0:${port}`);
})