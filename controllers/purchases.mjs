import Purchase from '../models/Purchase.mjs'
import Provider from '../models/Provider.mjs'
import Product from '../models/Product.mjs'
import mongoose from 'mongoose'

export function getAll(req, res) {
  let filter = {}
  if (req.query.provider) {
    filter.provider = req.query.provider
  }

  if (req.query.start) {
    filter.date = {
      $gte: req.query.start
    }
  }

  if (req.query.end) {
    if (!filter.date) {
      filter.date = {}
    }
    filter.date.$lte = req.query.end
  }

  Purchase.find(filter)
    .sort({ date: -1 })
    .populate('provider', 'name')
    .populate({
      path: 'list',
      populate: {
        path: 'product',
        populate: {
          path: 'category'
        }
      }
    })
    .then((purchaseList) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: purchaseList
      })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: err
      })
    })
}

export function getById(req, res) {
  Purchase.findById(req.params.id)
    .populate('provider', 'name')
    .populate({
      path: 'list',
      populate: {
        path: 'product',
        populate: {
          path: 'category'
        }
      }
    })
    .then((purchaseList) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: purchaseList
      })
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).json({
        success: false,
        message: err
      })
    })
}

export async function create(req, res) {
  if (!mongoose.isValidObjectId(req.body.provider)) {
    return res.status(404).json({
      success: false,
      message: 'Неправильний ID'
    })
  }
  const user = await Provider.findById(req.body.provider)
  if (!user) {
    return res.status(400).json({
      success: false,
      message: `Постачальника з наданим ID не знайденю`
    })
  }

  const lastPurchase = await Purchase.findOne().sort({
    date: -1
  })
  const maxPurchase = lastPurchase ? lastPurchase.number + 1 : 1

  const session = await mongoose.startSession()
  session.startTransaction()
  // insecure
  let totalPrice = 0
  req.body.list.forEach((item) => {
    totalPrice += +item.cost * +item.quantity
  })
  const purchase = new Purchase({
    number: maxPurchase,
    list: req.body.list,
    provider: req.body.provider,
    totalPrice: totalPrice
  })

  try {
    const savedPurchase = await purchase.save({ session })
    let error = await updateProductStock(null, savedPurchase, session)
    if (error) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({
        success: false,
        message: error
      })
    } else {
      await session.commitTransaction()
      session.endSession()
      return res.status(201).json({
        success: true,
        message: '',
        data: purchase
      })
    }
  } catch (err) {
    console.log(err)
    if (session.inTransaction()) {
      await session.abortTransaction()
    }
    session.endSession()
    return res.status(500).json({
      success: false,
      message: err
    })
  }
}

export async function update(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({
      success: false,
      message: 'Неправильний ID'
    })
  }
  const session = await mongoose.startSession()
  session.startTransaction()
  // insecure
  let totalPrice = 0
  req.body.list.forEach((item) => {
    totalPrice += +item.cost * +item.quantity
  })
  try {
    const purchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
        totalPrice: totalPrice
      },
      { session }
    )
    if (!purchase) {
      session.endSession()
      return res.status(404).json({
        success: false,
        message: 'Закупку не знайдено'
      })
    }
    let error = await updateProductStock(purchase, req.body, session)
    if (error) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({
        success: false,
        message: error
      })
    }
    await session.commitTransaction()
    session.endSession()
    return res.status(200).json({
      success: true,
      message: '',
      data: req.body
    })
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction()
    }
    session.endSession()
    return res.status(500).json({
      success: false,
      message: err
    })
  }
}

export async function remove(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Неправильний ID'
    })
  }
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const purchase = await Purchase.findByIdAndRemove(req.params.id, {
      session
    })
    if (purchase) {
      let error = await updateProductStock(purchase, null, session)
      if (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(400).json({
          success: false,
          message: error
        })
      }
      await session.commitTransaction()
      session.endSession()
      return res.status(200).json({
        success: true,
        message: 'Закупку видалено'
      })
    } else {
      session.endSession()
      return res.status(404).json({
        success: false,
        message: 'Закупку не знайдено'
      })
    }
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction()
    }
    session.endSession()
    return res.status(400).json({
      success: false,
      message: err
    })
  }
}

async function updateProductStock(oldPurchase, purchase, session) {
  if (oldPurchase && oldPurchase.list) {
    for (let item of oldPurchase.list) {
      const product = await Product.findById(item.product, null, { session })
      if (!product) {
        return `Не знайдено товар ${item.product}`
      } else {
        product.stock = Number(product.stock) - Number(item.quantity)
        if (product.stock < 0) {
          return `Недостатньо товару "${product.name}" у кількості ${Math.abs(
            product.stock
          )} шт.`
        }
        await Product.findByIdAndUpdate(item.product, product, {
          session
        })
      }
    }
  }
  if (purchase && purchase.list) {
    for (let item of purchase.list) {
      const product = await Product.findById(item.product, null, { session })
      if (!product) {
        return `Не знайдено товар ${item.product}`
      } else {
        product.stock = Number(product.stock) + Number(item.quantity)
        await Product.findByIdAndUpdate(item.product, product, {
          session
        })
      }
    }
  }
  return ''
}
