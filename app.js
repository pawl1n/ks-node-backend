require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

const port = process.env.PORT
console.log(process.env.PORT)

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('MongoDB connected.'))
	.catch((err) => console.log(err))

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(require('morgan')('dev'))
app.use(require('cors')())
//app.options('*', cors())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/analytics', require('./routes/analytics'))
app.use('/api/categories', require('./routes/categories'))
app.use('/api/orders', require('./routes/orders'))
app.use('/api/products', require('./routes/products'))

app.listen(port, () => {
	console.log(`Server is running on http://kishka-strybaie.ua:${port}`)
})
