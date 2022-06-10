import Order from '../models/Order.mjs'
import User from '../models/User.mjs'
import mongoose from 'mongoose'

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled']
const methods = ['PickupInSumy', 'NovaPoshta']

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
    .skip(+req.query.offset)
    .limit(+req.query.limit)
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
  if (!mongoose.isValidObjectId(req.body.user)) {
    return res.status(404).json({
      success: false,
      message: 'Неправильний ID'
    })
  }
  const user = await User.findById(req.body.user)
  if (!user) {
    return res.status(400).json({
      success: false,
      message: `Користувача з наданим ID не знайденю`
    })
  }

  if (!statuses.includes(req.body.status)) {
    return res.status(404).json({
      success: false,
      message: 'Не знайдено статус'
    })
  }
  if (!methods.includes(req.body.shipping.shippingMethod)) {
    return res.status(404).json({
      success: false,
      message: 'Не знайдено метод доставки'
    })
  }

  const lastOrder = await Order.findOne().sort({
    date: -1
  })
  const maxOrder = lastOrder ? lastOrder.order + 1 : 1

  const order = new Order({
    order: maxOrder,
    list: req.body.list,
    user: req.body.user,
    shipping: req.body.shipping
  })
  order
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: '',
        data: order
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err
      })
    })
}

export function update(req, res) {
  if (!statuses.includes(req.body.status)) {
    return res.status(404).json({
      success: false,
      message: 'Не знайдено статус'
    })
  }
  if (!methods.includes(req.body.shipping.shippingMethod)) {
    return res.status(404).json({
      success: false,
      message: 'Не знайдено метод доставки'
    })
  }

  Order.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'The order with geven ID was not found'
        })
      }
      return res.status(200).json({
        success: true,
        message: '',
        data: order
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err
      })
    })
}

export function remove(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Неправильний ID'
    })
  }
  Order.findByIdAndRemove(req.params.id)
    .then((order) => {
      if (order) {
        return res.status(200).json({
          success: true,
          message: 'Замовлення видалено'
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'Замовлення не знайдено'
        })
      }
    })
    .catch((err) => {
      return res.status(400).json({
        success: false,
        message: err
      })
    })
}
