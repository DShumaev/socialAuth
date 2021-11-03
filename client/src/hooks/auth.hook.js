import {useState, useEffect, useCallback} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [userName, setUserName] = useState(null)
    const [ready, setReady] = useState(false)

    const login = useCallback((jwtToken, id, name) => {
        setToken(jwtToken)
        setUserId(id)
        setUserName(name)

        try {
            localStorage.setItem(storageName, JSON.stringify({userId: id, userName: name, token: jwtToken}))
        } catch (e) {
            if (e == window.QUOTA_EXCEEDED_ERR) {
                alert('Limit of data is exceeded for Local Storage')
            }
        }
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setUserName(null)
        localStorage.removeItem(storageName)
    }, [login])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.userId, data.userName)
        }
        setReady(true)
    }, [login])

    return {login, logout, token, userId, userName, ready}
}