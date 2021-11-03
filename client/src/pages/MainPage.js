import React from 'react'
import {useState, useRef, useContext, useEffect} from 'react'
import {AuthContext} from '../context/AuthContext'
import {socket} from "../hooks/socket.hook"


export const MainPage = () => {
    const [messages, setMessages] = useState([])
    const messagesRef = useRef(null)
    const auth = useContext(AuthContext)

    useEffect(() => {
        socket.on('MESSAGE_FROM_SERVER', (message) => {
            setMessages((prev) => [...prev, message])
        })
    }, [])

    useEffect(() => {
        messagesRef.current.scrollTo(0, 99999)
    }, [messages])

    const sayBroHandler = () => {
        socket.emit('MESSAGE_TO_SERVER', {
            type: 'bro',
            text: 'Bro!',
            userName: auth.userName,
            userId: auth.userId,
            date: null
        })
    }

    const saySisHandler = () => {
        socket.emit('MESSAGE_TO_SERVER', {
            type: 'sis',
            text: 'Sis!',
            userName: auth.userName,
            userId: auth.userId,
            date: null
        })
    }

    const exitHandler = () => {
        auth.logout()
    }

    return (
        <div className="row">
            <div className="col s8" >
                <div className="card teal darken-1 mainBlock">
                    <div className="center-align">
                        <h5 className="white-text">{auth.userName}</h5>
                    </div>
                    <div name="dialog" ref={messagesRef} className="messages #c8e6c9 teal lighten-1">
                            {(messages.length > 0)
                                ?
                                messages.map((message, id) =>
                                    (<div key={id} className="message">
                                        <p>{message.text}</p>
                                        <div>
                                            <span className="text-darken-3">
                                                {`Sent by ${message.userName} at ${message.date}`}
                                            </span>
                                        </div>
                                    </div>))
                                :
                                <span>
                                    No messages yet :(
                                </span>
                            }
                    </div>
                    <div className="buttonContainer">
                        <a className="waves-effect waves-light btn" onClick={sayBroHandler}>Bro</a>
                        <a className="waves-effect waves-light btn" onClick={saySisHandler}>Sis</a>
                        <a className="waves-effect waves-light btn" onClick={exitHandler}>Exit</a>
                    </div>
                </div>
            </div>
        </div>
    )
}