const { asyncQuery } = require('../helpers/queryHelper')

module.exports = {
    showAll: async (req, res) => {
        try {
            const query = 
            `
                SELECT c.category, p.name, p.price, SUM(ps.available_stock/2) AS total_stock, GROUP_CONCAT(pi.image separator ', ') as images
                FROM product_storage ps
                LEFT JOIN products p ON ps.id_product=p.id_product
                LEFT JOIN categories c ON p.id_category=c.id_category
                LEFT JOIN product_images pi ON p.id_product=pi.id_product
                GROUP BY p.id_product
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