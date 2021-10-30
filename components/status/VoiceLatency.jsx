import {useState, useEffect} from 'react'
import ReactLoading from "react-loading";

export default function VoiceLatency() {
    const [locations, setLocations] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('https://latency.discord.media/rtc')
            .then(async resp => {
                if (!resp.ok) {
                    setError(true)
                } else {
                    setLocations(await resp.json())
                }
            })
    }, [])

    if (error) {
        return <div className="text-xl text-red-400">Failed to load rtc locations :(</div>
    }

    if (!locations) {
        return <ReactLoading type='bars' color="#dbdbdb" height={128} width={100} className="my-8 mx-auto"/>
    }

    return (
        <div>
            {locations.map((location, i) => (
                <div key={i} className="flex bg-dark-3 mb-3 p-3 items-center rounded-md">
                    <div className="text-4xl flex justify-center items-center w-12 h-12 bg-dark-5 rounded-full mr-3 flex-shrink-0">{i + 1}</div>
                    <div>
                        <div className="text-xl capitalize mb-1">{location.region}</div>
                        <div className="flex flex-wrap">
                            {location.ips.map(ip => (
                                <div key={ip} className="px-2 rounded-md bg-dark-4 mr-1 mb-1">{ip}</div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}