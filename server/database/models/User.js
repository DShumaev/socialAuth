const {Schema, model, Types} = require('mongoose')


const schema = new Schema({
    email: {type: String, required: true, unique: true},
    fullname: {type: String, required: true},
    password: {type: String, required: true},
    messages: [{type: Types.ObjectId, ref: 'Message'}]
})


module.exports = model('User', schema)