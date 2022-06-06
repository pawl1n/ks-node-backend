import User from '../models/User.mjs'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
const saltRounds = 10

export function getAll(req, res) {
  User.find()
    .select('-password')
    .then((userList) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: userList
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
      message: 'Invalid user ID'
    })
  }
  User.findById(req.params.id)
    .select('-password')
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          success: false,
          message: 'User with geven ID was not found'
        })
      }
      return res.status(200).json({
        success: true,
        message: '',
        data: user
      })
    })
    .catch((err) => {
      return res.status(200).json({
        success: true,
        message: '',
        data: user
      })
    })
}

export async function create(req, res) {
  const candidate = await User.findOne({
    email: req.body.email.toLowerCase()
  })

  if (candidate) {
    return res.status(409).json({
      success: false,
      message: 'User with this email exists'
    })
  } else {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRounds),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      shipping: {
        city: req.body.city,
        zip: req.body.zip,
        street: req.body.street,
        appartament: req.body.appartament,
        department: req.body.department,
        shippingMethod: req.body.shippingMethod
      }
    })

    user
      .save()
      .then(() => {
        return res.status(201).json({
          success: true,
          message: '',
          data: user
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

export function update(req, res) {
  User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
        ? bcrypt.hashSync(req.body.password, saltRounds)
        : undefined,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      shipping: {
        city: req.body.shipping.city,
        zip: req.body.shipping.zip,
        street: req.body.shipping.street,
        appartament: req.body.shipping.appartament,
        department: req.body.shipping.department,
        shippingMethod: req.body.shipping.shippingMethod
      }
    },
    {
      new: true
    }
  )
    .select('-password')
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          success: false,
          message: 'User with given ID was not found'
        })
      }
      return res.status(200).json({
        success: true,
        message: '',
        data: user
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
      message: 'Invalid user ID'
    })
  }
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (user) {
        return res.status(200).json({
          success: true,
          message: 'The user deleted'
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'User not found'
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

export async function login(req, res) {
  const user = await User.findOne({
    email: req.body.email.toLowerCase()
  })

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Невірно вказано email'
    })
  }
  if (
    req.body.password &&
    bcrypt.compareSync(req.body.password, user.password)
  ) {
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      },
      process.env.SECRET,
      {
        expiresIn: '1d'
      }
    )

    return res.status(200).json({
      success: true,
      message: '',
      data: {
        user: user.email,
        token: `Bearer: ${token}`
      }
    })
  } else {
    return res.status(404).json({
      success: false,
      message: 'Невірно вказано пароль'
    })
  }
}

export async function register(req, res) {
  const candidate = await User.findOne({
    email: req.body.email.toLowerCase()
  })

  if (candidate) {
    return res.status(409).json({
      success: false,
      message: 'Користувач з таким email вже існує'
    })
  } else {
    const user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, saltRounds)
    })

    user
      .save()
      .then(() => {
        return res.status(201).json({
          success: true,
          message: '',
          data: user
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
