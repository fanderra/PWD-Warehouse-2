const { asyncQuery } = require('../helpers/queryHelper')

module.exports = {
    getHistory: async ({ query: { id_user, id_order_status, page = 0, perPage = 5, orderBy } }, res) => {
        // console.log({ id_user, id_order_status, page , perPage  } )
        const orderByOption = {
            latest: 'o.date DESC',
            oldest: 'o.date ASC',
        }
        try {
            const query = `
                        SELECT
                            *
                        FROM
                            (select * from orders o
                        WHERE
                            o.id_user = ? and o.id_order_status =?
                            ORDER BY ${orderByOption[orderBy] || orderByOption.latest}
                            LIMIT ${page * perPage},${perPage}
                            ) o
                                JOIN
                            order_details od ON o.id_order = od.id_order
                                JOIN
                            products p ON p.id_product = od.id_product
                                JOIN
                            product_images pi ON pi.id_product = od.id_product
                                JOIN
                            order_status os ON os.id_order_status = o.id_order_status
                        GROUP BY id_order_detail
                        ORDER BY ${orderByOption[orderBy] || orderByOption.latest}
        `
            const result = await asyncQuery(query, [id_user, id_order_status])

            const dataThatWeSend = result.reduce((a, b, _, arr) => {
                const { id_order, date, id_order_status, shipment_fee, payment_method, status, payment_image, message, city, postal_code, address_detail } = b
                const index = a.findIndex(i => i.id_order === id_order)
                console.log(index)
                if (index === -1) {
                    a.push({
                        id_order,
                        date,
                        id_order_status,
                        city,
                        postal_code,
                        address_detail,
                        message,
                        status,
                        shipment_fee,
                        payment_method,
                        payment_image,
                        order_details: [],
                        total: shipment_fee
                    })
                    console.log(a, arr)
                    arr.forEach(da => {
                        const { price, name, image, qty, id_order } = da;
                        if (b.id_order === id_order) {
                            a[a.length - 1].order_details.push({ price, name, image, qty, id_order })
                            a[a.length - 1].total += price * qty
                        }
                    })
                }
                return a
            }, [])
            console.log(dataThatWeSend)
            res.status(200).send(dataThatWeSend)
        } catch (error) {
            res.status(400).send(error)
        }
    }
}