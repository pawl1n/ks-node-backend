import Purchase from '../models/Purchase.mjs'
import Provider from '../models/Provider.mjs'
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

  const purchase = new Purchase({
    number: maxPurchase,
    list: req.body.list,
    provider: req.body.provider
  })
  purchase
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        message: '',
        data: purchase
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

export function update(req, res) {
  Purchase.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((purchase) => {
      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: 'Закупку не знайдено'
        })
      }
      return res.status(200).json({
        success: true,
        message: '',
        data: purchase
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
  Purchase.findByIdAndRemove(req.params.id)
    .then((purchase) => {
      if (purchase) {
        return res.status(200).json({
          success: true,
          message: 'Закупку видалено'
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'Закупку не знайдено'
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
