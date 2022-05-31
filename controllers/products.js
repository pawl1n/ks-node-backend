const Category = require('../models/Category')
const Product = require('../models/Product')
const mongoose = require('mongoose')

module.exports.getAll = async function (req, res) {
	let filter = {}
	if (req.query.categories) {
		filter = {
			category: req.query.categories.split(',')
		}
	}

	const productList = await Product.find(filter).populate('category')

	if (productList) {
		res.send(productList)
	} else {
		res.status(500).json([])
	}
}

module.exports.getById = async function (req, res) {
	if (!mongoose.isValidObjectId(req.params.id)) {
		res.status(400).json({
			success: false,
			message: 'Invalid product ID'
		})
	}
	const product = await Product.findById(req.params.id).populate('category')
	if (!product) {
		res.status(500).json({
			success: false,
			message: 'The product with geven ID was not found'
		})
	} else {
		res.status(200).send(product)
	}
}

module.exports.getByCategoryId = async function (req, res) {
	const productList = await Product.find({
		category: req.params.id
	})
	console.log('catID: ' + req.params.id)

	if (productList) {
		res.send(productList)
	} else {
		res.status(500).json([])
	}
}

module.exports.create = async function (req, res) {
	try {
		const category = await Category.findById(req.body.category)
		if (!category) {
			res.status(400).json({
				success: false,
				message: 'Invalid category ID'
			})
		}
	} catch (err) {
		res.status(400).json({
			success: false,
			message: err
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
			res.status(201).json(product)
		})
		.catch((err) => {
			res.status(500).json({
				success: false,
				message: err
			})
			console.log(err)
		})
}

module.exports.update = async function (req, res) {
	const product = await Product.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
			description: req.body.description,
			images: req.body.images,
			price: req.body.price,
			category: req.body.category,
			article: req.body.article
		},
		{
			new: true
		}
	)
	if (!product) {
		res.status(500).json({
			success: false,
			message: 'The product with geven ID was not found'
		})
	} else {
		res.status(200).send(product)
	}
}

module.exports.remove = function (req, res) {
	if (!mongoose.isValidObjectId(req.params.id)) {
		res.status(400).json({
			success: false,
			message: 'Invalid product ID'
		})
	}
	Product.findByIdAndRemove(req.params.id)
		.then((product) => {
			if (product) {
				res.status(200).json({
					success: true,
					message: 'The product deleted'
				})
			} else {
				res.status(404).json({
					success: false,
					message: 'Product not found'
				})
			}
		})
		.catch((err) => {
			res.status(400).json({
				success: false,
				message: err
			})
		})
}

module.exports.count = function (req, res) {
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
			res.status(500).json({
				success: false,
				message: err
			})
		})
}
