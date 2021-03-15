const router = require('express').Router()
const { productController } = require('../controllers')

router.post('/showAll', productController.showAll)

module.exports = router