import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
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
      type: String
    }
  }
})

export default mongoose.model('User', userSchema)
