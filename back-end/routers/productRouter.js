const router = require('express').Router()
const { productController } = require('../controllers')

router.post('/showAllProductsForUser', productController.showAllProductsForUser)

module.exports = router