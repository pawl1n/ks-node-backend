const express = require('express')
const controller = require('../controllers/products')
const router = express.Router()

router.get('/', controller.getAll)
router.get('/:categoryId', controller.getByCategoryId)
router.post('/', controller.create)
router.patch('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = router
