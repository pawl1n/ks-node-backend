import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true,
    unique: true,
    sparse: true
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
  },
  created: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('User', userSchema)
