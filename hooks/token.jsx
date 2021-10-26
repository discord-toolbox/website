import {createContext, useContext, useEffect, useState} from 'react'

const Context = createContext(false)

export const TokenProvider = ({children}) => {
    const [token, setToken] = useState(null)

    useEffect(() => {
        if (process.browser) {
            const savedToken = localStorage.getItem('token')
            if (!token && savedToken) {
                setToken(savedToken)
            }
        }
    }, [])

    function wrappedSetToken(newToken) {
        if (process.browser) {
            if (newToken) {
                localStorage.setItem('token', newToken)
            } else {
                localStorage.removeItem('token')
            }
        }
        setToken(newToken)
    }

    return (
        <Context.Provider value={[token, wrappedSetToken]}>
            {children}
        </Context.Provider>
    )
}

export function useToken() {
    return useContext(Context)
}