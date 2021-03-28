const db = require('../database')
const fs = require('fs')
const { createToken } = require('../helpers/jwtHelper')
const { validationResult } = require('express-validator')
const cryptojs = require('crypto-js')
const secret_key = '!@#$%^&*'
const transporter = require('../helpers/nodemailer')
const { generateQuery, asyncQuery } = require('../helpers/queryHelper')
const handlebars = require('handlebars')

const cartQuery = `SELECT
                    p.id_product,
                    o.id_order,
                    od.qty,
                    p.name,
                    p.price,
                    ps.stock ,
                    pi.image,
                    p.id_product_status
                FROM
                    order_details od
                        JOIN
                    orders o ON o.id_order = od.id_order
                        JOIN
                    products p ON p.id_product = od.id_product
                        JOIN
                    product_images pi ON pi.id_product = p.id_product
                        JOIN
                    (SELECT
                        id_product, SUM(stock-purchased_stock) stock
                    FROM
                        storages
                    GROUP BY id_product) ps ON ps.id_product = p.id_product
                WHERE
                    o.id_user = ? and o.id_order_status=1
                    GROUP BY p.id_product 
                `



module.exports = {
    showAll: async (req, res) => {
        try {
            const queryUser = `SELECT * FROM users u JOIN roles r ON u.id_role=r.id_role`
            result = await asyncQuery(queryUser)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    login: async ({ body }, res) => {
        try {
            const { username, password } = body
            const query = [
                'select id_user,username,id_status,id_role,profile_picture from users where password=? and (username=? or email=?)',
                'select * from address where id_user=?',

            ]

            console.log(password)
            const [result1] = await asyncQuery(query[0], [cryptojs.HmacMD5(password, secret_key).toString(), username, username])

            if (!result1) return res.status(400).send('wrong username or password')

            const result2 = await asyncQuery(query[1], [result1.id_user])
            const cart = await asyncQuery(cartQuery, [result1.id_user])

            const token = createToken({ id: result1.id_user, username: result1.username })

            res.status(200).send({ ...result1, address: result2, token, cart })
        } catch (error) {
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    register: async (req, res) => {
        const { username, password, email } = req.body

        const error = validationResult(req)
        if (!error.isEmpty()) return res.status(400).send(error.array()[0].msg)

        const hashPass = cryptojs.HmacMD5(password, secret_key)
        try {
            const checkUser = `SELECT * FROM users 
                               WHERE username = ${db.escape(username)}
                               OR email = ${db.escape(email)}`
            const resCheck = await asyncQuery(checkUser)

            if (resCheck.length !== 0) return res.status(400).send('Username or email already exists')

            const queryRegister = `INSERT INTO users (username, password, email)
                                   VALUES (${db.escape(username)}, ${db.escape(hashPass.toString())}, ${db.escape(email)})`
            const resRegister = await asyncQuery(queryRegister)

            // setup nodemailer
            const token = createToken({ id: resRegister.insertId, username: username })

            // send email to user
            const option = {
                from: `admin <jordan.just.testing@gmail.com>`,
                to: email,
                subject: 'EMAIL VERIFICATION',
                text: 'click link below to verify your account'
            }

            // setup handlebars
            const emailFile = fs.readFileSync('./templates/userVerification.handlebars').toString()
            const template = handlebars.compile(emailFile)
            option.html = template({ username: username, link: `http://localhost:3000/verification?${token}` })

            const info = await transporter.sendMail(option)

            const getUser = `SELECT * FROM users
                             WHERE id_user = ${resRegister.insertId}`
            const resultGet = await asyncQuery(getUser)

            resultGet[0].token = token

            res.status(200).send(resultGet[0])
        } catch (err) {
            res.status(400).send(err)
        }
    },
    keepLogin: async ({ user }, res) => {
        try {
            const query = [
                'select id_user,username,id_status,id_role,email,profile_picture from users where id_user=? and username=? ',
                'select * from address where id_user=?'
            ]
            console.log(user)
            const [result1] = await asyncQuery(query[0], [user.id, user.username])
            console.log(result1)
            if (!result1) return res.status(400).send('user not found')
            const address = await asyncQuery(query[1], [user.id])
            const cart = await asyncQuery(cartQuery, [user.id])
            console.log(address)
            res.status(200).send({ ...result1, address, cart })
        } catch (error) {
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    editAddress: async (req, res) => {
        const { address_detail, id_user, id_address } = req.body
        try {
            const query = 'update address set address_detail=? where id_user=? and id_address=?'
            await asyncQuery(query, [address_detail, id_user, id_address])
            res.status(200).send('success')
        } catch (error) {
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    forgotPassword: async (req, res) => {
        const { email, username } = req.body
        try {
            const query = 'SELECT username,password FROM users WHERE email=? AND username =?'

            const [result] = await asyncQuery(query, [email, username])
            if (!result) return res.status(400).send(`email for ${username} is not ${email} please use the registered email`)
            // console.log('haha')
            const option = {
                from: 'Ikiya <ikiya@gmail.com>',
                to: email,
                subject: 'Forgot Password',
            }
            const file = fs.readFileSync('./templates/userResetPassword.handlebars').toString()
            const template = handlebars.compile(file)

            const { password } = result

            const random = Math.floor(Math.random() * (password.length - 4))

            const code = password.substr(random, 4)
            const matchPassword = password.substr(0, random) + ';' + password.substr(random + 4)

            console.log(code, matchPassword)

            const token = createToken({ username, password: matchPassword })
            option.html = template({ username, code, link: `http://localhost:3000/resetPassword/${token}` })

            transporter.sendMail(option)

            res.status(200).send(token)
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    resetPassword: async (req, res) => {
        const isValid = validationResult(req)
        try {
            const { username, password } = req.user
            const { code, password: newPassword } = req.body

            const query = [
                'select * from users where username=? and password=?',
                'update users set password=? where username=?'
            ]

            const [result1] = await asyncQuery(query[0], [username, password.replace(';', code)])
            console.log(code)
            if (!result1) return res.status(400).send('wrong verification code')

            if (!isValid.isEmpty()) return res.status(400).send(isValid.array().map(i => i.msg).join(', '))

            const result2 = await asyncQuery(query[1], [cryptojs.HmacMD5(newPassword, secret_key).toString(), username])

            res.status(200).send(result2)

        } catch (error) {
            console.log(error)
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    verification: async (req, res) => {
        try {
            const verify = `UPDATE users SET id_status = 2
                            WHERE id_user = ${req.user.id}
                            AND username = ${db.escape(req.user.username)}`
            const result = await asyncQuery(verify)

            res.status(200).send('email has been verified')
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    addAddress: async (req, res) => {
        try {
            const { lat, lng, id_user, label, address_detail, postal_code, city } = req.body
            console.log(req.body)
            const query = 'insert into address (label,address_detail,id_user,postal_code,city,lat,lng) values(?)'

            const addAddressInfo = await asyncQuery(query, [[label, address_detail, id_user, postal_code, city, lat, lng]])

            res.status(200).send(addAddressInfo)
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    deleteAddress: async ({ params }, res) => {
        try {
            const query = 'delete from address where id_address = ?'
            const result = await asyncQuery(query, [params.id_address])
            res.status(200).send(result)
        } catch (error) {
            console.log(error)
            res.status(400).send(error.message || error.sqlMessage || error)
        }
    },
    changeAddress: async (req, res) => {
        try {
            const { lat, lng, id_user, label, address_detail, postal_code, city, id_address } = req.body
            const query = `update address set label=?,address_detail=?,postal_code=?,city=?,lat=?,lng=? where id_user=${db.escape(id_user)} and id_address=${db.escape(id_address)}`

            const result = await asyncQuery(query, [label, address_detail, postal_code, city, lat, lng])
            res.status(200).send(result)
        }
        catch (err) {
            res.status(400).send(err.message || err.sqlMessage || err)
        }
    },
    uploadProfilePicture: async ({ file, body }, res) => {
        try {
            const query = 'update users set profile_picture=? where id_user=?'
            console.log(file)
            res.status(200).send('success')
            await asyncQuery(query, [`images/users/${file.filename}`, body.id_user])
        } catch (error) {
            res.status(200).send(error.message || error.sqlMessage || error);
        }
    },
    deleteProfilePicture: async ({ params }, res) => {
        try {
            const query = 'update users set profile_picture=NULL where id_user=?'
            await asyncQuery(query, [params.id_user])
            res.status(200).send('success')
        } catch (error) {
            res.status(200).send(error.message || error.sqlMessage || error);
        }
    },
    edit: async (req, res) => {
        try {
            await asyncQuery(`UPDATE users SET${generateQuery(req.body)} WHERE id_user=${db.escape(parseInt(req.params.id))}`)
            const result = await asyncQuery(`SELECT * FROM users u JOIN roles r ON u.id_role=r.id_role`)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    delete: async (req, res) => {
        try {
            await asyncQuery(`DELETE FROM users WHERE id_user=${db.escape(parseInt(req.params.id))}`)
            const result = await asyncQuery(`SELECT * FROM users u JOIN roles r ON u.id_role=r.id_role`)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}