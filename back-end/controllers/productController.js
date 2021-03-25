const { asyncQuery } = require('../helpers/queryHelper')

const showProducts =
    `
    SELECT c.category, asd.*, GROUP_CONCAT(pi.image SEPARATOR ', ') AS images, ps.status 
    FROM (
        SELECT p.*, SUM(s.stock) AS total_stock, SUM(s.purchased_stock) AS total_purchased_stock, GROUP_CONCAT(s.stock SEPARATOR ', ') AS stocks
        FROM products p
        JOIN storages s ON s.id_product=p.id_product
        GROUP BY p.id_product
    ) AS asd
    JOIN product_images pi ON asd.id_product=pi.id_product
    JOIN categories c ON asd.id_category=c.id_category
    JOIN product_status ps ON asd.id_status=ps.id_product_status
    GROUP BY asd.id_product
`

module.exports = {
    showAllProductsForUser: async (req, res) => {
        try {
            const result = await asyncQuery(showProducts + ` HAVING asd.id_status=1 AND total_stock>0 ORDER BY c.category`)
            result.map(item => { item.stocks = item.stocks.split(', '); item.images = item.images.split(', ') })
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}