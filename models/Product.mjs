import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	images: [
		{
			type: String
		}
	],
	price: {
		type: Number,
		required: true
	},
	category: {
		ref: 'Category',
		type: mongoose.Schema.Types.ObjectId
	},
	article: {
		type: String
	}
})

export default mongoose.model('Product', productSchema)
