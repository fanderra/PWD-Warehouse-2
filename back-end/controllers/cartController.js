const { asyncQuery } = require('../helpers/queryHelper')


module.exports = {
    addToCart: async (req, res) => {
        const { id_product, qty, id_user } = req.body
        try {
            const query = [
                'select id_order from orders where id_user=? and id_order_status= 1',
                'select id_order,id_product from order_details where id_order=? and id_product=?',
                'update order_details set qty=qty+? where id_order=? and id_product=?',
                'insert into orders (id_user, id_order_status) values (?,1)',
                'insert into order_details (id_order, id_product,qty) values (?)',
                'update products set purchased=purchased+? where id_product=?',
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
            const updatePurchased = await asyncQuery(query[5], [qty, id_product])
            console.log(updatePurchased)
            res.status(200).send('success')
        } catch (error) {
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    editCartQty: async (req, res) => {
        const {id_order, id_product,oldQty,newQty} = req.body
        if(!id_order||!id_product) return res.status(400).send('missing id_order or id_product')
        try {
            const query = [
                'delete from order_details where id_order=? and id_product=?',
                'update order_details set qty=? where id_order=? and id_product=?',
                'update products set purchased=purchased+? where id_product=?',
            ]

            if (newQty <= 0) {
                const deletedProduct = await asyncQuery(query[0], [id_order, id_product])
                console.log(deletedProduct)
            } else {
                const editedQty = await asyncQuery(query[1], [newQty,id_order, id_product])
                console.log(editedQty)
            }

            const updatePurchased = await asyncQuery(query[2],[newQty-oldQty,id_product])
            console.log(updatePurchased)
            console.log('ini',req.body)

            res.status(200).send('success')
        } catch (error) {
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    }
}