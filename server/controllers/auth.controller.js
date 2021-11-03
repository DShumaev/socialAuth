const database = require('../database/mongo')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const config = require('config')
const jwt = require('jsonwebtoken')


const socialUserAuth = {
    token: null,
    userId: null,
    userName: null
}

class authController {

    async register(req, res) {
        try {
            console.log('register')
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration information'
                })
            }
            const {email, password} = req.body
            const candidate = await database.checkUserInDatabase(email)

            if (candidate) {
                return res.status(400).json({message: 'User with this name created already'})
            }

            const hashedPassword = await bcrypt.hash(password, config.get('salt'))
            const userIsCreate = await database.addNewUser(email, hashedPassword)
            if (!userIsCreate) {
                console.log("Problem with adding new user to database")
                res.status(500).json({message: 'Unsuccessful procedure of registration'})
            }
            res.status(201).json({message: 'User created'})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Common error (procedure of registration)'})
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }
            const {email, password} = req.body
            const user = await database.getUserFromDatabase(email)
            if (!user) {
                return res.status(400).json({message: 'User with this email did not find'})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({message: 'Password incorrect, try again'})
            }

            const token = jwt.sign(
                {
                    userId: user.id
                },
                config.get('jwtSecret'),
                {
                    expiresIn: '2h'
                }
            )

            res.json({token, userId: user.id, userName: email})

        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Common error (procedure of login)'})
        }
    }

    async socialNetworkLoginSuccessful(req, res) {
        try {
            const email = req.user?.emails[0]?.value
            const fullname = req.user?.displayName ?? email
            const candidate = await database.checkUserInDatabase(email)
            if (!candidate) {
                const userIsCreate = await database.addNewUser(email, "***", fullname)
                if (!userIsCreate) {
                    console.log("Problem with adding new user to database")
                    res.status(500).json({message: 'Unsuccessful procedure of registration'})
                    return
                }
            }
            const user = await database.getUserFromDatabase(email)
            if (user) {
                const token = jwt.sign(
                    {
                        userId: user.id
                    },
                    config.get('jwtSecret'),
                    {
                        expiresIn: '2h'
                    })
                socialUserAuth.token = token
                socialUserAuth.userId = user.id
                socialUserAuth.userName = fullname
                if (!config.get('isProduction')) {
                    res.redirect(config.get('reactUrl'))
                } else {
                    res.redirect(config.get('baseUrl'))
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    sendTokenSocialNetworkAuth(req, res) {
        res.json(socialUserAuth)
        socialUserAuth.token = null
        socialUserAuth.userId = null
        socialUserAuth.userName = null
    }

    socialNetworkLoginUnsuccessful(req, res) {
        console.log("Unsuccessful login with social network")
    }

}

module.exports = new authController()