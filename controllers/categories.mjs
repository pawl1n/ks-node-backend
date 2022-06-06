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
      message: 'Invalid category ID'
    })
  }
  Category.findById(req.params.id)
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'The category with geven ID was not found'
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
      message: 'Category with this name exists'
    })
  } else {
    const category = new Category({
      name: req.body.name,
      icon: req.body.icon
    })

    category
      .save()
      .then(() => {
        return res.status(201).json(category)
      })
      .catch((err) => {
        return res.status(500).json({
          success: false,
          message: err
        })
        console.log(err)
      })
  }
}

export function update(req, res) {
  Category.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((category) => {
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'The category with geven ID was not found'
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
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid category ID'
    })
  }
  Category.findByIdAndRemove(req.params.id)
    .then((category) => {
      if (category) {
        return res.status(200).json({
          success: true,
          message: 'The category deleted'
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
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
