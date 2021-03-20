const { asyncQuery } = require('../helpers/queryHelper')
const geoLocation = require('measure-geolocation')
const transporter = require('../helpers/nodemailerHelper')
const handlebars = require('handlebars')
const fs=require('fs')
module.exports = {
    checkout: async (req, res) => {
        const { id_order, address_detail, lat, lng, city, postal_code, shipment_fee, payment_method, date = Date.now() } = req.body

        try {
            const query = [
                'update orders set ? where id_order=?',
                'select * from stores',
                'select od.*,p.name,p.price current_price,p.price * od.qty total from order_details od join products p on od.id_product=p.id_product where id_order=?',
                'select id_product,price from products where id_product in(?)',
                'update storages set purchased_stock=purchased_stock+? where id_store=? and id_product=?',
                'update order_details set price=? where id_product=? and id_order=?',
                'select username,email from orders o join users u on u.id_user=o.id_user where id_order=?'
            ]
            await asyncQuery(query[0], [
                {
                    address_detail,
                    lat,
                    lng,
                    city,
                    postal_code,
                    shipment_fee,
                    payment_method,
                    date,
                    id_order_status: payment_method==='TRANSFER'? 2:3
                },
                id_order
            ])

            const stores = await asyncQuery(query[1])

            let userCords = { lat, lon: lng }

            let sorted = stores.sort((a, b) => {
                a = geoLocation.getDistanceBetweenLocations({ lat: a.lat, lon: a.lng }, userCords)
                b = geoLocation.getDistanceBetweenLocations({ lat: b.lat, lon: b.lng }, userCords);
                return a - b
            })

            // console.log(sorted)
            const userCart = await asyncQuery(query[2], [id_order])
            console.log(userCart)

            const selectedProduct = await asyncQuery(query[3], [userCart.map(i => i.id_product)])
            console.log(selectedProduct)

            for await (let product of userCart) {
                await asyncQuery(query[4], [product.qty, sorted[0].id_store, product.id_product])
                await asyncQuery(query[5], [selectedProduct.find(i => i.id_product === product.id_product).price, product.id_product, id_order])
                // console.log(res1)
                // console.log(res2)
            }
            const [user]=await asyncQuery(query[6],[id_order])
            const option = {
                from: 'Ikiya <ikiya@gmail.com>',
                to: user.email,
                subject: payment_method==='TRANSFER' ?'Payment Confirmation':'Order Confirmation',
            }
            const file = fs.readFileSync(
                payment_method === 'TRANSFER' ?
                    './templates/waitingForPayment.handlebars' :
                    './templates/paymentConfirmed.handlebars'
            ).toString()
            const template = handlebars.compile(file)
            const total=userCart.reduce((a,b)=>a+b.total,0)
            option.html = template({ shipment_fee, username: user.username, cart: userCart, total, grand_total: total + shipment_fee,id_order})
            await transporter.sendMail(option)
            res.status(200).send({ id_order })
        } catch (error) {
            console.log(error.message || error.sqlMessage || error)
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    confirmPayment: async ({ file, body }, res) => {
        try {
            const query = [
                'update orders set id_order_status=3,payment_image=? where id_order=?',
                'select username,email from orders o join users u on u.id_user=o.id_user where o.id_order=?'
            ]
            const result = await asyncQuery(query[0], ['images/payments/' + file.filename, body.id_order])
            const [user] = await asyncQuery(query[1], [body.id_order])

            const option = {
                from: 'Ikiya <ikiya@gmail.com>',
                to: user.email,
                subject: 'Order Confirmation',
            }
            const html = fs.readFileSync('./templates/paymentConfirmed.handlebars').toString()
            const template = handlebars.compile(html)
            option.html = template({ username: user.username,id_order })
            
            res.status(200).send(result)
        } catch (error) {

            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    getPayment: async ({ params }, res) => {
        try {
            const query = 'select o.id_user,o.payment_method,sum(od.price*od.qty)+shipment_fee total,id_order_status from orders o join order_details od on od.id_order=o.id_order where o.id_order=?'
            const [result] = await asyncQuery(query, params.id_order)
            if (!result) return res.status(400).send('order not found')
            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    acceptPayment: async (req, res) => {
        const {id_order}=req.params
        try {
            const query = [
                'select id_store,lat,lng lon from stores',
                'select lat,lng lon from orders where id_order=?',
                'select * from order_details where id_order=?',
                'select id_product,stock-purchased_stock remain from storages where id_product in(?) and id_store=? having remain <0',
                'update storages set stock=stock+? where id_store=? and id_product=?',
                'update storages set stock=stock-? where id_store=? and id_product=?',
                'update storages set stock=stock-(purchased_stock-(purchased_stock-?)),purchased_stock=purchased_stock-? where id_store=? and id_product=?'
            ]
            const stores = await asyncQuery(query[0])
            const [userCords]= await asyncQuery(query[1],id_order)
            const userCart= await asyncQuery(query[2],id_order)
            const sorted = stores.sort((a, b) => {
                a = geoLocation.getDistanceBetweenLocations(a, userCords)
                b = geoLocation.getDistanceBetweenLocations(b, userCords);
                return a - b
            })
            const needStock = await asyncQuery(query[3],[userCart.map(i=>i.id_product),sorted[0].id_store])
            for await (let {remain,id_product} of needStock) {
                await asyncQuery(query[4], [remain, sorted[1].id_store, id_product])
                await asyncQuery(query[5], [remain, sorted[0].id_store, id_product])
            }
            for await (let { qty, id_product } of userCart) {
                await asyncQuery(query[6], [qty,qty,sorted[0].id_store, id_product])
            }
            res.status(200).send('success')
        } catch (error) {
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    }
}