const router = require('express').Router()
const { userController } = require('../controllers')
const { body } = require('express-validator')
const { verifyToken } = require('../helpers/jwt')

const registerValidation = [
    body('username')
        .notEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ min: 6 })
        .withMessage('Username must have a minimum of 6 characters'),
    body('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 6 })
        .withMessage('Password must have a minimum of 6 characters')
        .matches(/[0-9]/)
        .withMessage('Password must include a number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must include a symbol'),
    body('email')
        .isEmail()
        .withMessage('Email is invalid')
]

router.post('/register', registerValidation, userController.register)
router.post('/keepLogin', verifyToken, userController.keepLogin)
router.post('/showAll', userController.showAll)
router.post('/login', userController.login)

module.exports = router