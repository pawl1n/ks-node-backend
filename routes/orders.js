const express = require('express')
const controller = require('../controllers/orders')
const router = express.Router()

router.get('/', controller.getAll)
router.post('/', controller.create)
router.post('/:id', controller.update)

module.exports = router
