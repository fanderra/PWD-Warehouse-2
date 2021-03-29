const router = require('express').Router();

const { checkout, confirmPayment, getPayment, cancelOrder, confirmOrder, completeOrder } = require('../controllers').orderController

const { uploadPayment } = require('../helpers/multerHelper')



router.post('/checkout', checkout)
router.post('/confirmPayment', uploadPayment(), confirmPayment)
router.get('/getPayment/:id_order', getPayment)
router.post('/cancelOrder', cancelOrder)
router.post('/confirmOrder/:id_order', confirmOrder)
router.post('/complete/:id_order', completeOrder)

module.exports = router