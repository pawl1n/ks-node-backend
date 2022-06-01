import dotenv from 'dotenv'
dotenv.config()
import express, { urlencoded, json } from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import validate from './middleware/passport.mjs'
import morgan from 'morgan'
import cors from 'cors'
const app = express()

// Routes
import analyticsRouter from './routes/analytics.mjs'
import categoriesRouter from './routes/categories.mjs'
import ordersRouter from './routes/orders.mjs'
import productsRouter from './routes/products.mjs'
import usersRouter from './routes/users.mjs'

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('MongoDB connected.'))
	.catch((err) => console.log(err))

// Middleware
app.use(urlencoded({ extended: true }))
app.use(json())
app.use(morgan('dev'))
app.use(cors())
//app.options('*', cors())
app.use(passport.initialize())
validate(passport)

// Routes
app.use('/api/analytics', analyticsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)

const port = process.env.PORT
app.listen(port, () => {
	console.log(`Server is running on http://kishka-strybaie.ua:${port}`)
})
