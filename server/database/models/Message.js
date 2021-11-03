const {Schema, model, Types} = require('mongoose')


const schema = new Schema({
    text: {type: String, required: true},
    data: {type: Date, default: Date.now},
    author: {type: Types.ObjectId, ref: 'User'},
    type: String
})


module.exports = model('Message', schema)