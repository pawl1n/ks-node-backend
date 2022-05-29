const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
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
		type: Schema.Types.ObjectId
	},
	article: {
		type: String
	}
})

module.exports = mongoose.model('Product', productSchema)
