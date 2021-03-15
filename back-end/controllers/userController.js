const db = require('../database')
const { asyncQuery } = require('../helpers/queryHelp')
const { createToken } = require('../helpers/jwt')

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
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}