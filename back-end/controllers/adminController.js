const { asyncQuery } = require('../helpers/queryHelper')

module.exports = {
    showOrder: async (req, res) => {
        try {
            const query = `select * from orders o 
                           join order_details od on o.id_order = od.id_order
                           join products p on od.id_product = p.id_product
                           join users u on o.id_user = u.id_user
                           join order_status os on o.id_order_status = os.id_order_status`

            result = await asyncQuery(query)
            console.log('RESULt', result)
            const sendData = result.reduce((a, b, _, arr) => {
                const { id_order, shipment_fee, city, payment_method, username, address_detail, postal_code, status, id_order_status, message } = b
                const index = a.findIndex(i => i.id_order === id_order)
                console.log(index)
                if (index === -1) {
                    a.push({
                        id_order,
                        shipment_fee,
                        city,
                        payment_method,
                        username,
                        address_detail,
                        postal_code,
                        order_details: [],
                        total: shipment_fee,
                        status,
                        id_order_status,
                        message
                    })
                    console.log('akaka', a, arr)
                    arr.forEach(da => {
                        const { price, name, qty, id_order } = da
                        if (b.id_order === id_order) {
                            a[a.length - 1].order_details.push({ price, name, qty, id_order })
                            a[a.length - 1].total += price * qty
                        }
                    })
                }
                return a
            }, [])
            console.log(sendData)
            res.status(200).send(sendData)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    showInfo: async (req, res) => {
        try {
            const query = [`select *, GROUP_CONCAT(pi.image separator ', ') as images from products p
                            join categories c on p.id_category = c.id_category
                            join product_images pi on p.id_product = pi.id_product
                            group by p.id_product`,
                            `select * from storages s
                            join stores st on s.id_store = st.id_store`
            ]

            const result1 = await asyncQuery(query[0])

            const result2 = await asyncQuery(query[1])

            let sendData = result1.map(item => {
                item.storages = []
                result2.forEach(storage => {
                    if (item.id_product === storage.id_product) {
                        item.storages.push(storage)
                    }
                })
                return item
            })
            console.log(sendData)
            res.status(200).send(sendData)
        }
        catch (err) {
            res.status(400).send(error)
        }
    },
    showBestProduct: async (req, res) => {
        try {
            const query = `select * , sum(qty) as total from order_details od
                           join orders o on od.id_order = o.id_order
                           join products p on od.id_product = p.id_product
                           join categories c on p.id_category = c.id_category
                           where o.id_order_status = 5
                           group by od.id_product`

            const result = await asyncQuery(query)

            res.status(200).send(result)
        }
        catch (err) {
            res.status(400).send(err)
        }
    },
    showSales: async (req, res) => {
        try {
            const query = `select *, group_concat(name separator ', ') as names from users u 
                           join orders o on u.id_user = o.id_user
                           join order_details od on o.id_order = od.id_order
                           join products p on od.id_product = p.id_product
                           where o.id_order_status = 5
                           group by date`

            const result = await asyncQuery(query)
            result.map(item => item.names = item.names.split(', '))
            res.status(200).send(result)
        }
        catch (err) {
            res.status(400).send(err)
        }
    }
}