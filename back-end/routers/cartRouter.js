const router = require('express').Router();

const { addToCart, editCartQty, } = require('../controllers').cartController


router.post('/add', addToCart)
router.patch('/edit', editCartQty)

module.exports=router