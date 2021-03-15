const { asyncQuery } = require('../helpers/queryHelp')

module.exports = {
    showAll: async (req, res) => {
        try {
            const query = 
            `
                SELECT p.*, GROUP_CONCAT(pi.image separator ', ') as images, c.category
                FROM products p
                LEFT JOIN product_images pi ON p.id_product=pi.id_product
                LEFT JOIN categories c ON p.id_category=c.id_category
                GROUP BY p.id_product
                ORDER BY c.category
            `
            result = await asyncQuery(query)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}