import Category from '../models/Category.mjs'
import Product from '../models/Product.mjs'
import mongoose from 'mongoose'

export function getAll(req, res) {
	let filter = {}
	if (req.query.categories) {
		filter = {
			category: req.query.categories.split(',')
		}
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
			message: 'Invalid product ID'
		})
	}
	Product.findById(req.params.id)
		.populate('category')
		.then((product) => {
			if (!product) {
				return res.status(404).json({
					success: false,
					message: 'The product with geven ID was not found'
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

export function getByCategoryId(req, res) {
	Product.find({
		category: req.params.id
	})
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

export function create(req, res) {
	if (!mongoose.isValidObjectId(req.params.id)) {
		return res.status(404).json({
			success: false,
			message: 'Invalid category ID'
		})
	}
	Category.findById(req.body.category)
		.then((category) => {
			if (!category) {
				return res.status(400).json({
					success: false,
					message: 'Can`t find category with given ID'
				})
			}
			const product = new Product({
				name: req.body.name,
				description: req.body.description,
				images: req.body.images,
				price: req.body.price,
				category: req.body.category,
				article: req.body.article
			})
			product
				.save()
				.then(() => {
					return res.status(201).json({
						success: true,
						message: '',
						date: product
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
			return res.status(400).json({
				success: false,
				message: err
			})
		})
}

export function update(req, res) {
	Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
		.then((product) => {
			if (!product) {
				return res.status(200).json({
					success: false,
					message: 'The product with geven ID was not found'
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

export function remove(req, res) {
	if (!mongoose.isValidObjectId(req.params.id)) {
		return res.status(400).json({
			success: false,
			message: 'Invalid product ID'
		})
	}
	Product.findByIdAndRemove(req.params.id)
		.then((product) => {
			if (product) {
				return res.status(200).json({
					success: true,
					message: 'The product deleted'
				})
			} else {
				return res.status(404).json({
					success: false,
					message: 'Product not found'
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
