import {useState} from 'react'
import {formatDateTime, snowlfakeTimestamp} from "../../util";
import {useRouter} from "next/router";
import {useEffect} from 'react'


export default function DecodeSnowflake() {
    const [snowflake, setSnowflake] = useState('')
    const [result, setResult] = useState({})

    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) return
        if (router.query.id && !snowflake) {
            setSnowflake(router.query.id)
            decodeSnowflake(router.query.id)
        }
    }, [router])

    function decodeSnowflake(newSnowflake) {
        if (!newSnowflake) return

        const timestamp = snowlfakeTimestamp(newSnowflake)
        if (!timestamp) {
            setResult({error: 'The snowflake seems to be invalid. Please make sure that you have entered it correctly!'})
        } else {
            setResult({data: {timestamp}})
        }
    }

    function handleInput(e) {
        setSnowflake(e.target.value.replace(/\D/g, '').trim())
    }

    return (
        <div className="bg-dark-3 p-5 rounded-md">
            <div className="text-lg text-gray-300 mb-5">Please enter a valid Snowflake (Discord ID) below to decode it.
                If you aren't sure how to obtain a
                Discord ID please follow the instructions <a href="/docs" target="_blank"
                                                             className="text-blue-400 hover:text-blue-300">here</a>.
            </div>
            <form className="flex flex-col md:flex-row text-xl" onSubmit={e => {
                e.preventDefault();
                decodeSnowflake(snowflake);
            }}>
                <input type="text" className="px-3 py-2 rounded-md bg-dark-4 placeholder-gray-500 flex-grow mb-3 md:mb-0 md:mr-3"
                       placeholder="410488579140354049" value={snowflake} onChange={handleInput}/>
                <button className="px-3 py-2 rounded-md bg-green-500 flex-initial hover:bg-green-600"
                        type="submit">Decode
                </button>
            </form>

            {
                result.error ? (
                    <div className="mt-3 text-red-400">{result.error}</div>
                ) : result.data ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 sm:justify-items-center mt-12 mb-5 gap-5">
                        <div>
                            <div className="font-bold text-xl mb-2">Created At</div>
                            <div className="text-xl text-gray-300">{formatDateTime(result.data.timestamp)}</div>
                        </div>
                        <div>
                            <div className="font-bold text-xl mb-2">UNIX Timestamp</div>
                            <div className="text-xl text-gray-300">{result.data.timestamp.getTime() / 1000}</div>
                        </div>
                    </div>
                ) : ''
            }
        </div>
    )
}