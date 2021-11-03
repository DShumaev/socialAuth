import React from 'react'
import {useState, useEffect, useContext} from 'react'
import {useHttp} from "../hooks/http.hook"
import {useNotification} from "../hooks/notification.hook"
import {AuthContext} from "../context/AuthContext"
import {socket} from "../hooks/socket.hook"
import {config} from 'congif'


export const AuthPage = () => {

    const auth = useContext(AuthContext)
    const notice = useNotification()
    const {loading, error, request, clearError} = useHttp()
    const [form, setForm] = useState({
        email: "",
        password: ""
    })

    const [counterMessage, setCounterMessage] = useState({
        'bro': 0,
        'sis': 0
    })

    useEffect(() => {
        socket.emit('STATISTIC_FROM_SERVER', {
            roomId: 'all'
        })
        socket.on('STATISTIC_FOR_CLIENT', (counter) => {
            console.log('установка статистики')
            setCounterMessage({
                'bro': counter.bro,
                'sis': counter.sis
                })
        })
    }, [])

    useEffect(async () => {
        const data = await request('/auth/social_network/get_token')
        if (data.token && data.userId && data.userName) {
            auth.login(data.token, data.userId, data.userName)
        }
    }, [])

    useEffect(() => {
        notice(error)
        clearError()
    }, [error, notice, clearError])

    useEffect(() => {
        window.M.updateTextFields()
    }, [])

    const changeHandler = event => {
        setForm({ ...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const data = await request('/auth/register', 'POST', {...form})
            notice(data.message)
        } catch (e) {
            console.log(e)
        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/auth/login', 'POST', {...form})
            auth.login(data.token, data.userId, data.userName)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <div className="row mainContainer">
            <div className="col s6 offset-s3">
                <div className="card teal darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Login or register </span>
                        <div>
                            <div className="input-field">
                                <input
                                    placeholder="enter email"
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={form.email}
                                    onChange={changeHandler}
                                />
                                <p></p>
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field">
                                <input
                                    placeholder="enter password"
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={changeHandler}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button
                            className="waves-effect waves-light btn"
                            style={{marginRight: 10}}
                            onClick={loginHandler}
                            disabled={loading}
                        >
                            Sign In
                        </button>
                        <button
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Sign Up
                        </button>
                    </div>
                    <div className="card-action">
                        <span className="white-text">or just use one of social networks below</span>
                    </div>
                    <div className="card-action">
                        <a className="waves-effect waves-light btn socialAuthBtn"
                           href={config.get('authFacebookURL')}
                        >
                            Facebook
                        </a>
                        <a className="waves-effect waves-light btn socialAuthBtn"
                           href={config.get('authGoogleURL')}
                        >
                            Google
                        </a>
                        <a className="waves-effect waves-light btn socialAuthBtn"
                           href={config.get('authVKontakteURL')}
                        >
                            Vkontakte
                        </a>
                    </div>
                    <div className="card-action">
                        <div className="collapsible">
                            <div className="collapsible-header">
                                Count of "Bro!" message:
                                <span className="badge">{counterMessage.bro}</span>
                            </div>
                            <div className="collapsible-header">
                                Count of "Sis!" message:
                                <span className="badge right-aligned">{counterMessage.sis}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}