const router = require('express').Router()
const { adminController } = require('../controllers')

router.post('/showOrder', adminController.showOrder)
router.post('/showInfo', adminController.showInfo)
router.post('/showBestProduct', adminController.showBestProduct)
router.post('/showSales', adminController.showSales)

module.exports = router