import mongoose from 'mongoose'

const purchaseSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  number: {
    type: Number,
    required: true
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
  provider: {
    ref: 'Provider',
    type: mongoose.Schema.Types.ObjectId
  }
})

export default mongoose.model('Purchase', purchaseSchema)
