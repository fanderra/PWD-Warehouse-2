const db=require('../database')
const util = require('util')


module.exports = {
    asyncQuery:util.promisify(db.query).bind(db)
}