import {useState} from 'react'
import {formatDateTime} from "../../util";


export default function DecodeSnowflake() {
    const [snowflake, setSnowflake] = useState('')
    const [result, setResult] = useState({})

    function decodeSnowflake() {
        if (!snowflake) return

        const epoch = 1420070400000;
        const timestamp = new Date(snowflake / 4194304 + epoch);
        if (!timestamp || isNaN(timestamp.getTime())) {
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
            <form className="flex text-xl" onSubmit={e => {
                e.preventDefault();
                decodeSnowflake();
            }}>
                <input type="text" className="px-3 py-2 rounded-md bg-dark-4 placeholder-gray-500 flex-grow mr-3"
                       placeholder="410488579140354049" value={snowflake} onChange={handleInput}/>
                <button className="px-3 py-2 rounded-md bg-green-500 flex-initial hover:bg-green-600"
                        type="submit">Decode
                </button>
            </form>

            {
                result.error ? (
                    <div className="mt-3 text-red-400">{result.error}</div>
                ) : result.data ? (
                    <div className="grid grid-cols-2 justify-items-center mt-12 mb-5">
                        <div>
                            <div className="text-gray-400 text-xl mb-2">Created At</div>
                            <div className="text-xl">{formatDateTime(result.data.timestamp)}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 text-xl mb-2">UNIX Timestamp</div>
                            <div className="text-xl">{result.data.timestamp.getTime() / 1000}</div>
                        </div>
                    </div>
                ) : ''
            }
        </div>
    )
}