const router = require('express').Router();

const {checkout,confirmPayment,getPayment} = require('../controllers').orderController

const { uploadPayment}=require('../helpers/multerHelper')



router.post('/checkout', checkout)
router.post('/confirmPayment', uploadPayment(), confirmPayment)
router.get('/getPayment/:id_order', getPayment)
module.exports=router