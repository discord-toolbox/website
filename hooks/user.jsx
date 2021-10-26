import {createContext, useContext, useState, useEffect} from 'react'
import {useToken} from "./token";
import {apiRequest} from "../util";

const Context = createContext(false)

export const UserProvider = ({children}) => {
    const [token] = useToken()
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (!token) {
            setUser(null)
            return
        }

        apiRequest(
            '/auth/user',
            {token}
        ).then(async resp => {
            if (!resp.ok) {
                setUser(null)
            } else {
                setUser(await resp.json())
            }
        })
    }, [token])

    return (
        <Context.Provider value={user}>
            {children}
        </Context.Provider>
    )
}

export function useUser() {
    return useContext(Context)
}