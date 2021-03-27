const { asyncQuery } = require('../helpers/queryHelper')


module.exports = {
    addToCart: async (req, res) => {
        let { id_product, qty, id_user } = req.body
        try {
            const checkStock = `SELECT
                                    od.id_product,
                                    od.qty,
                                    o.id_user,
                                    o.id_order_status,
                                    s.stock,
                                    s.stock-qty remain
                                FROM
                                    order_details od
                                        JOIN
                                    orders o ON o.id_order = od.id_order
                                        JOIN
                                    (SELECT
                                        id_product, SUM(stock - purchased_stock) stock
                                    FROM
                                        storages
                                    WHERE
                                        id_product = ?) s ON s.id_product = od.id_product
                                WHERE
                                    id_user = ? AND o.id_order_status = 1 and od.id_product=?
                                    HAVING remain-? <0
                                    `
            
            const [isStockAvailable] = await asyncQuery(checkStock, [id_product, id_user, id_product, qty])
            if (isStockAvailable) qty = isStockAvailable.remain
            
                const query = [
                    'select id_order from orders where id_user=? and id_order_status= 1',
                    'select id_order,id_product from order_details where id_order=? and id_product=?',
                    'update order_details set qty=qty+? where id_order=? and id_product=?',
                    'insert into orders (id_user, id_order_status) values (?,1)',
                    'insert into order_details (id_order, id_product,qty) values (?)',
                ]

            let id_order;

            let [checkIdOrderExist] = await asyncQuery(query[0], [id_user])

            if (!checkIdOrderExist) {

                let insertNewIdOrder = await asyncQuery(query[3], [id_user])
                console.log(insertNewIdOrder)

                if (!insertNewIdOrder.insertId) return res.status(400).send('something wrong in our server')

                id_order = insertNewIdOrder.insertId
                const insertedProduct = await asyncQuery(query[4], [[id_order, id_product, qty]])
                console.log(insertedProduct)
            }
            if (checkIdOrderExist) {
                id_order = checkIdOrderExist.id_order
                const [isProductExist] = await asyncQuery(query[1], [id_order, id_product])
                if (isProductExist) {
                    const updateQty = await asyncQuery(query[2], [qty, id_order, id_product])
                    console.log(updateQty)
                } else {
                    const insertedProduct = await asyncQuery(query[4], [[id_order, id_product, qty]])
                    console.log(insertedProduct)
                }
            }
            res.status(200).send('success')
        } catch (error) {
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    editCartQty: async (req, res) => {
        let { id_order, id_product, newQty } = req.body
        if (!id_order || !id_product) return res.status(400).send('missing id_order or id_product')
        try {
            const checkStock = `SELECT
                                    od.id_product,
                                    od.qty,
                                    o.id_user,
                                    o.id_order_status,
                                    s.stock,
                                FROM
                                    order_details od
                                        JOIN
                                    orders o ON o.id_order = od.id_order
                                        JOIN
                                    (SELECT
                                        id_product, SUM(stock - purchased_stock) stock
                                    FROM
                                        storages
                                    WHERE
                                        id_product = ?) s ON s.id_product = od.id_product
                                WHERE
                                    od.id_order = ? AND o.id_order_status = 1 and od.id_product=?
                                    HAVING stock-? <0
                                    `

            const [isStockAvailable] = await asyncQuery(checkStock, [id_product, id_order, id_product, newQty])
            if (isStockAvailable) newQty = isStockAvailable.stock

            const query = [
                'delete from order_details where id_order=? and id_product=?',
                'update order_details set qty=? where id_order=? and id_product=?',
            ]

            if (newQty <= 0) {
                const deletedProduct = await asyncQuery(query[0], [id_order, id_product])
                console.log(deletedProduct)
            } else {
                const editedQty = await asyncQuery(query[1], [newQty, id_order, id_product])
                console.log(editedQty)
            }
            console.log('ini', req.body)

            res.status(200).send('success')
        } catch (error) {
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
}