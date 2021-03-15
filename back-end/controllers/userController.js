const db = require('../database')
const fs = require('fs')
const { createToken } = require('../helpers/jwt')
const { validationResult } = require('express-validator')
const cryptojs = require('crypto-js')
const secret_key = '!@#$%^&*'
const transporter = require('../helpers/nodemailer')
const { generateQuery, asyncQuery } = require('../helpers/queryHelp')
const handlebars = require('handlebars')

module.exports = {
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