const express = require('express')
const controller = require('../controllers/products')
const router = express.Router()

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.get('/get/ByCategory/:id', controller.getByCategoryId)
router.get('/get/count/', controller.count)
router.post('/', controller.create)
router.patch('/:id', controller.update)
router.delete('/:id', controller.remove)

module.exports = router
