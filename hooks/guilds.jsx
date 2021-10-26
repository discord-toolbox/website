import {createContext, useContext, useState, useEffect} from 'react'
import {useToken} from "./token";
import {apiRequest} from "../util";

const Context = createContext(false)

export const GuildsProvider = ({children}) => {
    const [token] = useToken()
    const [guilds, setGuilds] = useState(null)

    useEffect(() => {
        if (!token) {
            setGuilds(null)
            return
        }

        apiRequest(
            '/auth/guilds',
            {token}
        ).then(async resp => {
            if (!resp.ok) {
                setGuilds(null)
            } else {
                setGuilds(await resp.json())
            }
        })
    }, [token])

    return (
        <Context.Provider value={guilds}>
            {children}
        </Context.Provider>
    )
}

export function useGuilds() {
    return useContext(Context)
}