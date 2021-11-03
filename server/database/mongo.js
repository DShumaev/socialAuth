const User = require('../database/models/User')
const Message = require('../database/models/Message')


class Mongo {

    checkUserInDatabase(email) {
        return User.findOne({email})
    }

    async addNewUser(email, hashedPassword, fullname = email) {
        try {
            const user = new User({email: email, fullname: fullname, password: hashedPassword})
            await user.save()
            return true
        } catch (e) {
            return false
        }
    }

    getUserFromDatabase(email) {
        return User.findOne({email})
    }

    async addNewMessage({text, userId, type}) {
        try {
            const message = new Message({text, author: userId, type})
            await message.save()
            return {isAdded: true, message}
        } catch (e) {
            return {isAdded: false, message: null}
        }
    }

}


module.exports = new Mongo()