import Order, { statuses, methods } from '../models/Order.mjs'
import User from '../models/User.mjs'
import Product from '../models/Product.mjs'
import mongoose from 'mongoose'
import { sendMail } from '../helpers/mail.mjs'

export function getStatuses(req, res) {
  res.status(200).json({
    success: true,
    message: '',
    data: statuses
  })
}

export function getMethods(req, res) {
  res.status(200).json({
    success: true,
    message: '',
    data: methods
  })
}

export function getAll(req, res) {
  let filter = {}
  if (req.query.user) {
    filter.user = req.query.user
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

  Order.find(filter)
    .sort({ date: -1 })
    // .skip(+req.query.offset)
    // .limit(+req.query.limit)
    .populate('user', 'name email')
    .populate({
      path: 'list',
      populate: {
        path: 'product',
        populate: {
          path: 'category'
        }
      }
    })
    .then((orderList) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: orderList
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err
      })
    })
}

export function getById(req, res) {
  Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate({
      path: 'list',
      populate: {
        path: 'product',
        populate: {
          path: 'category'
        }
      }
    })
    .then((orderList) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: orderList
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err
      })
    })
}

export async function create(req, res) {
  let user = undefined
  let customerOrder = false
  if (mongoose.isValidObjectId(req.body.user)) {
    user = await User.findById(req.body.user)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `Клієнта з наданим ID не знайденю`
      })
    }
  } else if (req.body.user.name && req.body.user.email && req.body.user.phone) {
    customerOrder = true
    user = await User.findOne({ email: req.body.user.email })
    if (!user) {
      user = await User.create({
        name: req.body.user.name,
        email: req.body.user.email,
        phone: req.body.user.phone,
        shipping: req.body.shipping
      })
    }
  } else {
    return res.status(404).json({
      success: false,
      message: 'Не знайдено клієнта'
    })
  }

  if (req.body.status && !statuses.includes(req.body.status)) {
    return res.status(404).json({
      success: false,
      message: 'Не знайдено статус'
    })
  }
  if (
    req.body.shipping.shippingMethod &&
    !methods.includes(req.body.shipping.shippingMethod)
  ) {
    return res.status(404).json({
      success: false,
      message: 'Не знайдено метод доставки'
    })
  }
  if (!req.body.shipping.shippingMethod) {
    req.body.shipping.shippingMethod = 'Other'
  }

  const lastOrder = await Order.findOne().sort({
    date: -1
  })
  const maxOrder = lastOrder ? lastOrder.order + 1 : 1

  let totalPrice = 0
  let list = []

  for (let item of req.body.list) {
    if (item.id) {
      const product = await Product.findById(item.id)
      if (!product) {
        throw `Не знайдено товар ${item.id}`
      }
      console.log(product, item)
      totalPrice += +product.price * +item.quantity
      list.push({
        product: product._id,
        quantity: item.quantity,
        cost: product.price
      })
    } else {
      totalPrice += +item.cost * +item.quantity
      list.push(item)
    }
  }

  const order = new Order({
    order: maxOrder,
    list: list,
    user: user._id,
    shipping: req.body.shipping,
    totalPrice: totalPrice
  })

  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const savedOrder = await order.save({ session })
    let error = await updateProductStock(null, savedOrder, session)
    if (error) {
      await session.abortTransaction()
      session.endSession()
      return res.status(400).json({
        success: false,
        message: error
      })
    } else {
      if (customerOrder) {
        sendMail(user.name, order, user.email)
      }

      await session.commitTransaction()
      session.endSession()
      return res.status(201).json({
        success: true,
        message: '',
        data: savedOrder
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
  if (req.body.status && !statuses.includes(req.body.status)) {
    return res.status(404).json({
      success: false,
      message: 'Не знайдено статус'
    })
  }
  if (
    req.body.shipping.shippingMethod &&
    !methods.includes(req.body.shipping.shippingMethod)
  ) {
    return res.status(404).json({
      success: false,
      message: 'Не знайдено метод доставки'
    })
  }
  const session = await mongoose.startSession()
  session.startTransaction()

  let totalPrice = 0
  req.body.list.forEach((item) => {
    totalPrice += +item.cost * +item.quantity
  })

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, totalPrice },
      { session }
    )
    if (!order) {
      session.endSession()
      return res.status(404).json({
        success: false,
        message: 'Замовлення не знайдено'
      })
    }
    let error = await updateProductStock(order, req.body, session)
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
    console.log(err)
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
    const order = await Order.findByIdAndRemove(req.params.id, { session })
    if (order) {
      let error = await updateProductStock(order, null, session)
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
        message: 'Замовлення видалено'
      })
    } else {
      session.endSession()
      return res.status(404).json({
        success: false,
        message: 'Замовлення не знайдено'
      })
    }
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction()
    }
    session.endSession()
    console.log(err)
    return res.status(400).json({
      success: false,
      message: err
    })
  }
}

async function updateProductStock(oldOrder, order, session) {
  const canceled = 'Canceled'
  if (oldOrder && oldOrder.list && oldOrder.status != canceled) {
    for (let item of oldOrder.list) {
      const product = await Product.findById(item.product)
      if (!product) {
        return `Не знайдено товар ${item.product}`
      } else {
        product.stock = Number(product.stock) + Number(item.quantity)
        await Product.findByIdAndUpdate(item.product, product, { session })
      }
    }
  }
  if (order && order.list && order.status != canceled) {
    for (let item of order.list) {
      const product = await Product.findById(item.product)
      if (!product) {
        return `Не знайдено товар ${item.product}`
      } else {
        product.stock = Number(product.stock) - Number(item.quantity)
        if (product.stock < 0) {
          return `Недостатньо товару "${product.name}" у кількості ${Math.abs(
            product.stock
          )} шт.`
        }
        await Product.findByIdAndUpdate(item.product, product, { session })
      }
    }
  }
  return ''
}
