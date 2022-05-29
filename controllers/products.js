const Category = require('../models/Category')
const Product = require('../models/Product')

module.exports.getAll = function (req, res) {
	res.status(200).json({
		getById: true
	})
}

module.exports.getByCategoryId = function (req, res) {
	res.status(200).json({
		getById: true
	})
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

module.exports.update = function (req, res) {
	res.status(200).json({
		getById: true
	})
}

module.exports.remove = function (req, res) {
	res.status(200).json({
		getById: true
	})
}
