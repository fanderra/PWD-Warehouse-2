const router = require('express').Router()
const { productController } = require('../controllers')

router.post('/showAllProductsForUser', productController.showAllProductsForUser)
router.post('/showAllProductsForAdmin', productController.showAllProductsForAdmin)
router.post('/add', productController.addProduct)
router.post('/edit/:id', productController.editProduct)
router.post('/delete/:id', productController.deleteProduct)

module.exports = router