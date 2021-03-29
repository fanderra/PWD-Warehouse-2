const router = require('express').Router();

const { getHistory} = require('../controllers').historyController

router.get('/get', getHistory)
module.exports = router