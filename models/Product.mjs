import mongoose from 'mongoose'

export const types = ['Men', 'Women', 'Kids']

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
    type: Number,
    default: 0
  },
  size: {
    type: String
  },
  type: {
    type: String,
    enum: types
  }
})

export default mongoose.model('Product', productSchema)
