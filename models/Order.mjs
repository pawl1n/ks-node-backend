import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
	date: {
		type: Date,
		default: Date.now
	},
	order: {
		type: Number,
		required: true
	},
	sale: {
		type: Number
	}
	list: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId
			},
			quantity: {
				type: Number
			},
			cost: {
				type: Number
			}
		}
	],
	user: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId
	}
})

export default mongoose.model('Order', orderSchema)
