const { asyncQuery } = require('../helpers/queryHelper')

module.exports = {
    showAll: async (req, res) => {
        try {
            const query =
                `
                SELECT c.category, asd.*, GROUP_CONCAT(pi.image separator ', ') as images
                FROM (
                    SELECT p.*, SUM(s.stock) AS total_stock
                    FROM products p
                    JOIN storages s ON s.id_product=p.id_product
                    GROUP BY p.id_product
                ) AS asd
                JOIN product_images pi ON asd.id_product=pi.id_product
                JOIN categories c ON asd.id_category=c.id_category
                GROUP BY asd.id_product
            `
            result = await asyncQuery(query)
            result.map(item => item.images = item.images.split(', '))
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}