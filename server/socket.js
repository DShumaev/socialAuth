const database = require('./database/mongo')

module.exports = io => {
    let countBroMessage = 0
    let countSisMessage = 0

    io.on('connection', socket => {

        socket.on('STATISTIC_FROM_SERVER', ({roomId}) => {
            try {
                const statistic = {
                    'bro': countBroMessage,
                    'sis': countSisMessage
                }
                socket.broadcast.emit('STATISTIC_FOR_CLIENT', statistic)
                socket.emit('STATISTIC_FOR_CLIENT', statistic)
            } catch (e) {
                console.log(e)
            }
        })

        socket.on('MESSAGE_TO_SERVER', async ({type, text, userName, userId}) => {
            if (type === 'bro')
                countBroMessage++
            else if (type === 'sis')
                countSisMessage++
            try {
                const dateObject = new Date()
                let year = dateObject.getFullYear()
                let date = ("0" + dateObject.getDate()).slice(-2)
                let month = ("0" + (dateObject.getMonth() + 1)).slice(-2)
                let hours = ("0" + dateObject.getHours()).slice(-2)
                let minutes = ("0" + dateObject.getMinutes()).slice(-2)
                let dateMessage = hours + ":" + minutes + "  " + date + "." + month + "." + year
                const message = {
                    type,
                    text,
                    userName,
                    date: dateMessage
                }
                socket.broadcast.emit('MESSAGE_FROM_SERVER', message)
                socket.emit('MESSAGE_FROM_SERVER', message)
                const statistic = {
                    'bro': countBroMessage,
                    'sis': countSisMessage
                }
                socket.broadcast.emit('STATISTIC_FOR_CLIENT', statistic)
                const saveMessage = await database.addNewMessage({text, userId, type})
                if (!saveMessage.isAdded) console.log('problem with saving message to Database')
            } catch (e) {
                console.log(e)
            }
        })

        socket.on('disconnect', () => {
            try {
                if (io.engine.clientsCount && io.engine.clientsCount < 2) {
                    countBroMessage = 0
                    countSisMessage = 0
                }
            } catch (e) {
                console.log(e)
            }
        })
    })
}
