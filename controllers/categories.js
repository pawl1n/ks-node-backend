const Category = require('../models/Category')
const mongoose = require('mongoose')

module.exports.getAll = async function (req, res) {
	const categoryList = await Category.find()

	if (categoryList) {
		res.send(categoryList)
	} else {
		res.status(500).json([])
	}
}

module.exports.getById = async function (req, res) {
	if (!mongoose.isValidObjectId(req.params.id)) {
		res.status(400).json({
			success: false,
			message: 'Invalid category ID'
		})
	}
	const category = await Category.findById(req.params.id)
	if (!category) {
		res.status(500).json({
			success: false,
			message: 'The category with geven ID was not found'
		})
	} else {
		res.status(200).send(category)
	}
}

module.exports.create = async function (req, res) {
	const candidate = await Category.findOne({
		name: req.body.name
	})

	if (candidate) {
		res.status(409).json({
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
				res.status(201).json(category)
			})
			.catch((err) => {
				res.status(500).json({
					success: false,
					message: err
				})
				console.log(err)
			})
	}
}

module.exports.update = async function (req, res) {
	const category = await Category.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
			icon: req.body.icon
		},
		{
			new: true
		}
	)
	if (!category) {
		res.status(500).json({
			success: false,
			message: 'The category with geven ID was not found'
		})
	} else {
		res.status(200).send(category)
	}
}

module.exports.remove = function (req, res) {
	if (!mongoose.isValidObjectId(req.params.id)) {
		res.status(400).json({
			success: false,
			message: 'Invalid category ID'
		})
	}
	Category.findByIdAndRemove(req.params.id)
		.then((category) => {
			if (category) {
				res.status(200).json({
					success: true,
					message: 'The category deleted'
				})
			} else {
				res.status(404).json({
					success: false,
					message: 'Category not found'
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
