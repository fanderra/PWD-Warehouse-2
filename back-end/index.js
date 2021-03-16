require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()


app.use(cors())
app.use(bodyParser.json())

app.use(express.static(__dirname + '/public'))

const response = (req, res) => res.status(200).send('<h1>Group Project</h1>')
app.get('/', response)

const db = require('./database')
db.connect((err) => {
    if (err) return console.log(`Error connecting : ${err.stack}`)
    console.log(`Connected as id : ${db.threadId}`)
})

const { userRouter, productRouter } = require('./routers')

app.use('/user', userRouter)
app.use('/product', productRouter)

const PORT = 2000
app.listen(PORT, () => console.log(`Connected to port: ${PORT}`))