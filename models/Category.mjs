import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	icon: {
		type: String,
		default: ''
	}
})

export default mongoose.model('Category', categorySchema)
