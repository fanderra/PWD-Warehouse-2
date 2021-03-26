const { generateQuery, asyncQuery } = require('../helpers/queryHelper')
const db = require('../database')

const showProducts =
`
    SELECT c.category, asd.*, GROUP_CONCAT(pi.image SEPARATOR ', ') AS images, ps.* 
    FROM (
        SELECT p.*, SUM(s.stock) AS total_stock, SUM(s.purchased_stock) AS total_purchased_stock, GROUP_CONCAT(s.stock SEPARATOR ', ') AS stocks
        FROM products p
        JOIN storages s ON s.id_product=p.id_product
        GROUP BY p.id_product
    ) AS asd
    JOIN product_images pi ON asd.id_product=pi.id_product
    JOIN categories c ON asd.id_category=c.id_category
    JOIN product_status ps ON asd.id_product_status=ps.id_product_status
    GROUP BY asd.id_product
`

module.exports = {
    showAllProductsForUser: async (req, res) => {
        try {
            const result = await asyncQuery(showProducts + ` HAVING asd.id_product_status=1 AND total_stock>0 ORDER BY c.category`)
            result.map(item => { item.stocks = item.stocks.split(', '); item.images = item.images.split(', ') })
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    showAllProductsForAdmin: async (req, res) => {
        try {
            const result = await asyncQuery(showProducts + `ORDER BY c.category`)
            result.map(item => { item.stocks = item.stocks.split(', '); item.images = item.images.split(', ') })
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    showAllCategories: async (req, res) => {
        try {
            const query = await asyncQuery(`SELECT * FROM categories`)
            query.shift()
            res.status(200).send(query)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    addProduct: async (req, res) => {
        try {
            const check = await asyncQuery(`SELECT * FROM products WHERE name=${db.escape(req.body.name)}`)
            if (check.length !== 0) return res.status(400).send('Product with this name already exists')
            const produk = `INSERT INTO products (name, price, id_product_status) VALUES (${db.escape(req.body.name)}, ${db.escape(req.body.price)}, '2')`
            const stok1 = `INSERT INTO storages (id_store, id_product, stock, purchased_stock) VALUES ('1', ${db.escape(req.body.id_product)}, '0', '0')`
            const stok2 = `INSERT INTO storages (id_store, id_product, stock, purchased_stock) VALUES ('2', ${db.escape(req.body.id_product)}, '0', '0')`
            const gambar1 = `INSERT INTO product_images (image, id_product) VALUES ('images/products/NO_IMAGE.jpg', ${db.escape(req.body.id_product)})`
            const gambar2 = `INSERT INTO product_images (image, id_product) VALUES ('images/products/NO_IMAGE.jpg', ${db.escape(req.body.id_product)})`
            await asyncQuery(produk)
            await asyncQuery(stok1)
            await asyncQuery(stok2)
            await asyncQuery(gambar1)
            await asyncQuery(gambar2)
            const result = await asyncQuery(showProducts + `ORDER BY ps.status DESC`)
            result.map(item => { item.stocks = item.stocks.split(', '); item.images = item.images.split(', ') })
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    editProduct: async (req, res) => {
        try {
            const produk = `UPDATE products SET name=${db.escape(req.body.name)}, price=${db.escape(req.body.price)}, id_product_status=1 WHERE id_product=${db.escape(parseInt(req.params.id))}`
            const stok1 = `UPDATE storages SET stock=${db.escape(req.body.stock1)} WHERE id_store="1" AND id_product=${db.escape(parseInt(req.params.id))}`
            const stok2 = `UPDATE storages SET stock=${db.escape(req.body.stock2)} WHERE id_store="2" AND id_product=${db.escape(parseInt(req.params.id))}`
            const category = `UPDATE products SET id_category=${db.escape(req.body.id_category)} WHERE id_product=${db.escape(parseInt(req.params.id))}`
            await asyncQuery(produk)
            await asyncQuery(stok1)
            await asyncQuery(stok2)
            await asyncQuery(category)
            const result = await asyncQuery(showProducts + `ORDER BY c.category`)
            result.map(item => { item.stocks = item.stocks.split(', '); item.images = item.images.split(', ') })
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await asyncQuery(`UPDATE products SET id_product_status=2 WHERE id_product=${db.escape(parseInt(req.params.id))}`)
            const result = await asyncQuery(showProducts + `ORDER BY c.category`)
            result.map(item => { item.stocks = item.stocks.split(', '); item.images = item.images.split(', ') })
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    addCategory: async (req, res) => {
        try {
            const check = await asyncQuery(`SELECT * FROM categories WHERE category=${db.escape(req.body.category)}`)
            if (check.length !== 0) return res.status(400).send('This category already exists')
            if (req.body.category === '') return res.status(400).send('Input cannot be empty')
            await asyncQuery(`INSERT INTO categories (category) VALUES (${db.escape(req.body.category)})`)
            const result = await asyncQuery(`SELECT * FROM categories`)
            result.shift()
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    editCategory: async (req, res) => {
        try {
            const produk = `UPDATE categories SET category=${db.escape(req.body.category)} WHERE id_category=${db.escape(parseInt(req.params.id))}`
            await asyncQuery(produk)
            const result = await asyncQuery(`SELECT * FROM categories`)
            result.shift()
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await asyncQuery(`DELETE FROM categories WHERE id_category=${db.escape(parseInt(req.params.id))}`)
            await asyncQuery(`UPDATE products SET id_category=1 WHERE id_category=${db.escape((req.body.id_category))}`)
            const result = await asyncQuery(`SELECT * FROM categories`)
            result.shift()
            const result2 = await asyncQuery(showProducts)
            result2.map(item => { item.stocks = item.stocks.split(', '); item.images = item.images.split(', ') })
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    moveStock: async (req, res) => {
        try {
            const stock1 = `UPDATE storages SET stock=${db.escape(req.body.stock1)} WHERE id_store="1" AND id_product=${db.escape(parseInt(req.params.id))}`
            const stock2 = `UPDATE storages SET stock=${db.escape(req.body.stock2)} WHERE id_store="2" AND id_product=${db.escape(parseInt(req.params.id))}`
            await asyncQuery(stock1)
            await asyncQuery(stock2)
            const result = await asyncQuery(showProducts + `ORDER BY c.category`)
            result.map(item => { item.stocks = item.stocks.split(', '); item.purchased_stocks = item.purchased_stocks.split(', '); item.images = item.images.split(', ') })
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}