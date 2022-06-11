import mongoose from 'mongoose'

export const statuses = [
  'Pending',
  'Processing',
  'Shipped',
  'Delivered',
  'Canceled'
]
export const methods = ['PickupInSumy', 'NovaPoshta', 'Other']

const orderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: statuses,
    default: 'Pending'
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
    postal: {
      type: String,
      default: ''
    },
    street: {
      type: String,
      default: ''
    },
    building: {
      type: String,
      default: ''
    },
    department: {
      type: String
    },
    shippingMethod: {
      type: String,
      enum: methods,
      default: 'Other'
    },
    phone: {
      type: String
    }
  },
  totalPrice: {
    type: Number
  }
})

export default mongoose.model('Order', orderSchema)
