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
    type: Number
  },
  stock: {
    type: Number
  },
  category: {
    ref: 'Category',
    type: mongoose.Schema.Types.ObjectId
  },
  article: {
    type: String
  },
  type: {
    type: String,
    enum: types
  },
  sizes: [
    {
      name: {
        type: String,
        unique: true,
        required: true
      },
      price: {
        type: Number
      },
      stock: {
        type: Number
      }
    }
  ]
})

export default mongoose.model('Product', productSchema)
