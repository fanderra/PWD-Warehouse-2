const router = require('express').Router()
const { productController } = require('../controllers')

router.post('/showAllProductsForUser', productController.showAllProductsForUser)
router.post('/showAllProductsForAdmin', productController.showAllProductsForAdmin)
router.post('/showAllCategories', productController.showAllCategories)
router.post('/add', productController.addProduct)
router.post('/edit/:id', productController.editProduct)
router.post('/delete/:id', productController.deleteProduct)
router.post('/addCategory', productController.addCategory)
router.post('/editCategory/:id', productController.editCategory)
router.post('/deleteCategory/:id', productController.deleteCategory)

module.exports = router