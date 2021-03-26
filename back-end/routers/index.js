const userRouter = require('./userRouter')
const productRouter=require('./productRouter')
const cartRouter=require('./cartRouter')
const orderRouter= require('./orderRouter')
const historyRouter= require('./historyRouter')
const adminRouter= require('./adminRouter')
module.exports = {
    userRouter,
    productRouter,
    cartRouter,
    orderRouter,
    historyRouter,
    adminRouter
}