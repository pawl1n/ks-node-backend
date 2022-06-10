import Provider from '../models/Provider.mjs'
import mongoose from 'mongoose'
const saltRounds = 10

export function getAll(req, res) {
  Provider.find()
    .then((providerList) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: providerList
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
      message: 'Направильний ID'
    })
  }
  Provider.findById(req.params.id)
    .then((provider) => {
      if (!provider) {
        return res.status(200).json({
          success: false,
          message: 'Не знайдено постачальника з наданим ID'
        })
      }
      return res.status(200).json({
        success: true,
        message: '',
        data: provider
      })
    })
    .catch((err) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: provider
      })
    })
}

export async function create(req, res) {
  const provider = new Provider({
    name: req.body.name
  })

  provider
    .save()
    .then((provider) => {
      return res.status(201).json({
        success: true,
        message: '',
        data: provider
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
  Provider.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name
    },
    {
      new: true
    }
  )
    .then((provider) => {
      if (!provider) {
        return res.status(200).json({
          success: false,
          message: 'Не знайдено постачальника з наданим ID'
        })
      }
      return res.status(200).json({
        success: true,
        message: '',
        data: provider
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
  Provider.findByIdAndRemove(req.params.id)
    .then((provider) => {
      if (provider) {
        return res.status(200).json({
          success: true,
          message: 'Постачальника видалено'
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'Постачальника не знайдено'
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
