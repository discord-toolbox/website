import {useState, useEffect} from 'react'
import {apiRequest} from "../../util";


export default function StagingStatus() {
    const [status, setStatus] = useState({})

    useEffect(() => {
        apiRequest('/status/staging')
            .then(async resp => {
                if (resp.ok) {
                    setStatus(await resp.json())
                }
            })
    }, [])

    function closedDays() {
        if (!status.last_open) return 0

        const oneDay = 24 * 60 * 60 * 1000;
        const lastOpen = new Date(status.last_open * 1000)
        return Math.round(Math.abs((new Date() - lastOpen) / oneDay))
    }

    return (
        <div className="flex bg-dark-3 p-4 items-center rounded-md">
            <div className="mr-5">
                <img
                    src={status.open ? 'https://cdn.discordapp.com/emojis/758426141764616242.gif' : 'https://cdn.discordapp.com/emojis/775398227562201139.png'}
                    alt="" className="rounded-full bg-dark-4"/>
            </div>
            {status.open ? (
                <div>
                    <div className="text-3xl text-green-400 mb-1">Staging is open!!!</div>
                    <div className="text-gray-300 text-lg">Is this a dream or has the holy Jake finally heard our prayers?</div>
                </div>
            ) : (
                <div>
                    <div className="text-3xl text-red-400 mb-1">Staging is closed</div>
                    <div className="text-gray-300 text-lg">Day {closedDays()} of waiting for Jake to re-open staging for us</div>
                </div>
            )}
        </div>
    )
}