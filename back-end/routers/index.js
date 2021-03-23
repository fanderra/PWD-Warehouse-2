const userRouter = require('./userRouter')
const productRouter=require('./productRouter')
const cartRouter=require('./cartRouter')
const orderRouter= require('./orderRouter')
const historyRouter= require('./historyRouter')
module.exports = {
    userRouter,
    productRouter,
    cartRouter,
    orderRouter,
    historyRouter
}