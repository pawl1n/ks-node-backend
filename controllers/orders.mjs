import Order from '../models/Order.mjs'
import User from '../models/User.mjs'
import mongoose from 'mongoose'

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

export function getByUserId(req, res) {
	Order.find({
		user: req.params.userId
	})
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
			message: 'Invalid user ID'
		})
	}
	const user = await User.findById(req.body.user)
	if (!user) {
		return res.status(400).json({
			success: false,
			message: `Can't find user with given ID`
		})
	}

	const lastOrder = await Order.findOne({
		user: req.body.user
	}).sort({
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
	if (!isValidObjectId(req.params.id)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid order ID'
		})
	}
	Order.findByIdAndRemove(req.params.id)
		.then((order) => {
			if (order) {
				return res.status(200).json({
					success: true,
					message: 'The order deleted'
				})
			} else {
				return res.status(404).json({
					success: false,
					message: 'Order not found'
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
