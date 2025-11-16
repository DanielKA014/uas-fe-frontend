const users  = require('../controllers/users_controller.js')
const {createUserValidator} = require('../middlewares/validator.js')
const express = require('express')
const router = express.Router()
const { passportAuth, isTokenBlacklisted } = require('../middlewares/authenticate.js')

router.post('/register', createUserValidator, users.createUser)
router.post('/login', users.userLogin)
router.post('/logout', users.userLogout)

router.get(
    '/me',
    isTokenBlacklisted,
    passportAuth,
    (req, res) => {
        res.json({
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        })
    }
)

module.exports = router;
