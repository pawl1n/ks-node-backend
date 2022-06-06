import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false
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
    }
  }
})

export default mongoose.model('User', userSchema)
