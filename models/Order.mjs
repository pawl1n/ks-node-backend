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
	list: [
		{
			product: {
				ref: 'Product',
				type: mongoose.Schema.Types.ObjectId,
				required: true
			},
			quantity: {
				type: Number,
				required: true
			},
			cost: {
				type: Number,
				required: true
			}
		}
	],
	user: {
		ref: 'User',
		type: mongoose.Schema.Types.ObjectId
	},
	shipping: {
		city: {
			type: String,
			default: ''
		},
		zip: {
			type: String,
			default: ''
		},
		street: {
			type: String,
			default: ''
		},
		appartament: {
			type: String,
			default: ''
		},
		department: {
			type: String
		},
		shippingMethod: {
			type: String
		},
		phone: {
			type: String
		}
	}
})

export default mongoose.model('Order', orderSchema)
