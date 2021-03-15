const
    nodeMailer = require('nodemailer'),
    transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jordan.just.testing@gmail.com',
            pass: 'rxjyfxksjzrtypke'
        },
        tls: {
            rejectUnauthorized: true
        }
    })


module.exports = transporter