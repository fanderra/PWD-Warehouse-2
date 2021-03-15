const db = require('../database')
const { asyncQuery } = require('../helpers/queryHelp')
const { createToken } = require('../helpers/jwt')
const fs = require('fs')
const { createToken } = require('../helpers/jwtHelper')
const { validationResult } = require('express-validator')
const cryptojs = require('crypto-js')
const secret_key = '!@#$%^&*'
const transporter = require('../helpers/nodemailer')
const { generateQuery, asyncQuery } = require('../helpers/queryHelper')
const handlebars = require('handlebars')

module.exports = {
    showAll: async (req, res) => {
        try {
            const queryUser = `SELECT * FROM users`
            result = await asyncQuery(queryUser)
            res.status(200).send(result)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    },
    login: async (req, res) => {
        try {
            const userQuery = await asyncQuery(`SELECT * FROM users WHERE ${db.escape(req.body.username)} IN (username, email) AND password=${db.escape(req.body.password)}`)
            if (userQuery.length === 0) return res.status(400).send('Invalid username and/or password')
            let token = createToken({ id: userQuery[0].id_user, username: userQuery[0].username })
            userQuery[0].token = token
            res.status(200).send(userQuery[0])
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

            if (resCheck.length !== 0) return res.status(400).send('username or email is already exist')

            const queryRegister = `INSERT INTO users (username, password, email)
                                   VALUES (${db.escape(username)}, ${db.escape(hashPass.toString())}, ${db.escape(email)})`
            const resRegister = await asyncQuery(queryRegister)

            // setup nodemailer
            const token = createToken({id : resRegister.insertId, username: username})

            // send email to user
            const option = {
                from : `admin <jordan.just.testing@gmail.com>`,
                to : email, 
                subject : 'EMAIL VERIFICATION',
                text : 'click link below to verify your account'
            }

            // setup handlebars
            const emailFile = fs.readFileSync('./email/index.html').toString()
            const template = handlebars.compile(emailFile)
            option.html = template({username: username, link : `http://localhost:3000/verification?${token}`})

            const info = await transporter.sendMail(option)

            const getUser = `SELECT * FROM users
                             WHERE id_user = ${resRegister.insertId}`
            const resultGet = await asyncQuery(getUser)

            resultGet[0].token = token

            res.status(200).send(resultGet[0])
        }
    },
    keepLogin: async (req, res) => {        
        try {
            const getUser = `SELECT * FROM users WHERE username="${req.user.username}"`
            const result = await asyncQuery(getUser)
            res.status(200).send(result[0])
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}