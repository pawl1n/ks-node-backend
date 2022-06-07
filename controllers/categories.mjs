import Category from '../models/Category.mjs'
import mongoose from 'mongoose'

export function getAll(req, res) {
  Category.find()
    .then((categoryList) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: categoryList
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
      message: 'Неправильний ID категорії'
    })
  }
  Category.findById(req.params.id)
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Категорію з наданим ID не знайдено'
        })
      }
      return res.status(200).json({
        success: true,
        message: '',
        data: category
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
  const candidate = await Category.findOne({
    name: req.body.name
  })

  if (candidate) {
    return res.status(409).json({
      success: false,
      message: 'Така категорія вже існує'
    })
  } else {
    const category = new Category({
      name: req.body.name,
      icon: req.body.icon
    })

    category
      .save()
      .then(() => {
        return res.status(201).json({
          success: true,
          message: '',
          data: category
        })
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err
        })
      })
  }
}

export async function update(req, res) {
  const candidate = await Category.findOne({
    name: req.body.name
  })
  if (candidate) {
    return res.status(409).json({
      success: false,
      message: 'Така категорія вже існує'
    })
  }
  Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Категорію з наданим ID не знайдено'
        })
      }
      return res.status(200).json({
        success: true,
        message: '',
        data: category
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
      message: 'Неправильний ID категорії'
    })
  }
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: 'Категорію видалено'
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'Категорію не знайдено'
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
