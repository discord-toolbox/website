import {useRouter} from "next/router";
import {useEffect, useState} from 'react'
import {apiRequest, apiUrl} from "../util";
import {useToken} from "../hooks/token";

export default function Login() {
    const router = useRouter()
    const [token, setToken] = useToken()

    const [result, setResult] = useState(null)

    useEffect(() => {
        if (!router.isReady) {
            setResult(null)
            return
        }

        if (router.query.code) {
            apiRequest(
                '/auth/exchange',
                {
                    method: 'POST',
                    data: {code: router.query.code}
                }
            ).then(async resp => {
                if (!resp.ok) {
                    setResult(false)
                    setTimeout(() => router.push('/login'), 3000)
                } else {
                    const data = await resp.json()
                    setToken(data.token)
                    setTimeout(() => router.push('/about-me'), 3000)
                }
            })
        } else {
            window.location.replace(apiUrl('/auth/redirect'))
        }
    }, [router])

    if (result === false) {

    }

    if (result) {

    }

    return (
        <div>

        </div>
    )
}