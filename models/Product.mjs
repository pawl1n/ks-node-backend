import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
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
  },
  stock: {
    type: Number
  },
  size: {
    type: String
  }
})

export default mongoose.model('Product', productSchema)
