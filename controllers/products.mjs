import Category from '../models/Category.mjs'
import Product from '../models/Product.mjs'
import mongoose from 'mongoose'
import { unlinkSync } from 'fs'

export function getAll(req, res) {
  let filter = {}
  if (req.query.categories) {
    filter.category = req.query.categories.split(',')
  }
  if (req.query.controlStock) {
    filter.stock = { $gt: 0 }
  }

  Product.find(filter)
    .populate('category')
    .then((productList) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: productList
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
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Неправильний ID товара'
    })
  }
  Product.findById(req.params.id)
    .populate('category')
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Товар з наданим ID не знайдено'
        })
      }
      return res.status(200).json({
        success: true,
        message: '',
        data: product
      })
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err
      })
    })
}

export function create(req, res) {
  if (!req.body.category) {
    return res.status(400).json({
      success: false,
      message: 'Необхідно ввести категорію'
    })
  }

  const categoryId = req.body.category?._id
    ? req.body.category._id
    : req.body.category

  if (!mongoose.isValidObjectId(categoryId)) {
    return res.status(404).json({
      success: false,
      message: 'Неправильний ID категорії'
    })
  }

  Category.findById(categoryId)
    .then((category) => {
      if (!category) {
        return res.status(400).json({
          success: false,
          message: `Не вдалося знайти категорію за наданим ID`
        })
      }
      let files = []
      req.files?.forEach((file) => {
        files.push(file.path)
      })
      const product = new Product({
        name: req.body.name,
        description: req.body.description,
        images: files ? files : null,
        price: req.body.price,
        category: categoryId,
        article: req.body.article,
        stock: req.body.stock,
        size: req.body.size
      })
      product
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            message: '',
            data: product
          })
        })
        .catch((err) => {
          return res.status(500).json({
            success: false,
            message: err
          })
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
  let files = []
  req.files?.forEach((file) => {
    files.push(file.path)
  })
  files = files.concat(req.body.images || [])
  console.log(req.body)

  Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      images: files,
      price: req.body.price,
      category: req.body.category,
      article: req.body.article,
      stock: req.body.stock,
      size: req.body.size
    },
    { new: true }
  )
    .populate('category')
    .then((product) => {
      if (!product) {
        return res.status(200).json({
          success: false,
          message: 'The product with geven ID was not found'
        })
      }
      console.log(req.body.removedImages)
      req.body.removedImages?.forEach((file) => {
        unlinkSync(file)
      })
      return res.status(200).json({
        success: true,
        message: '',
        data: product
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

export function remove(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Неправильний ID товара'
    })
  }
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        product.images?.forEach((image) => {
          unlinkSync(image)
        })
        return res.status(200).json({
          success: true,
          message: 'Товар видалено'
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'Товар не знайдено'
        })
      }
    })
    .catch((err) => {
      return res.status(500).json({
        success: false,
        message: err
      })
    })
}

export function count(req, res) {
  Product.countDocuments()
    .then((productCount) => {
      res.send({
        count: productCount,
        success: true,
        message: ''
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

export async function getPrice(req, res) {
  try {
    if (req.body.items) {
      let ans = {
        totalPrice: 0,
        items: []
      }

      for (let item of req.body.items) {
        const product = await Product.findById(item.id)
        if (product.stock < item.quantity) {
          throw `Недостатньо товару ${product.name} у кількості ${
            item.quantity - product.stock
          }`
        } else {
          let subTotal = item.quantity * product.price
          ans.items.push({
            id: product._id,
            name: product.name,
            quantity: item.quantity,
            stock: product.stock,
            cost: product.price,
            subTotal: subTotal,
            article: product.article,
            size: product.size
          })
          ans.totalPrice += subTotal
        }
      }

      return res.status(200).json({
        success: true,
        message: '',
        data: ans
      })
    } else {
      throw 'Неправильно виконаний запит'
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err
    })
  }
}
