
const
    multer = require('multer'),
    path = require('path')
    ;

module.exports = {
    uploadPayment: () => {
        const storage = multer.diskStorage({
            destination: path.join(__dirname + '../../public/images/payments'),
            filename: (_, file, cb) => {
                console.log(file)
                cb(null, 'payment-' + Date.now() + '-' + file.originalname)
            }
        })
        return multer({ storage }).single('IMG')
    },
    uploadProductImages: () => {
        const storage = multer.diskStorage({
            // destination: path.join(__dirname + '../../public/products'),
            destination: path.join(__dirname + '../../public/images/products'),
            filename: (_, file, cb) => {
                console.log(file)
                cb(null, 'product-' + Date.now() + '-' + file.originalname)
            }
        })
        // const storage = multer({ storage }).array('IMG', 5)
        return multer({ storage }).array('IMG', 5)
    }
}

console.log(path.join(__dirname + '../../public/images/payments'))

// console.log(Date.now().toString(23))

