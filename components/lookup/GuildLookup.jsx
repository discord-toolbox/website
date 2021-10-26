import {useState} from 'react'
import ReactLoading from "react-loading";
import Tooltip from "../Tooltip";


export default function GuildLookup() {
    const [guildId, setGuildId] = useState('')
    const [result, setResult] = useState({})

    function lookupGuild() {
        if (!guildId) return

        setResult({loading: true})

        fetch(`https://discord.com/api/guilds/${guildId}/widget.json`)
            .then(async resp => {
                if (!resp.ok) {
                    setResult({error: 'The server does not exist or has the widget disabled.'})
                } else {
                    setResult({data: await resp.json()})
                }
            })
    }

    function handleInput(e) {
        setGuildId(e.target.value.replace(/\D/g, '').trim())
    }

    return (
        <div className="bg-dark-3 p-5 rounded-md">
            <div className="text-lg text-gray-300 mb-5">Please enter a valid Discord Server ID below to look it up. If
                you aren't sure how to obtain a
                Discord Server ID please follow the instructions <a href="/docs" target="_blank"
                                                                    className="text-blue-400 hover:text-blue-300">here</a>.
            </div>
            <form className="flex text-xl" onSubmit={e => {
                e.preventDefault();
                lookupGuild();
            }}>
                <input type="text" className="px-3 py-2 rounded-md bg-dark-4 placeholder-gray-500 flex-grow mr-3"
                       placeholder="410488579140354049" value={guildId} onChange={handleInput}/>
                <button className="px-3 py-2 rounded-md bg-green-500 flex-initial hover:bg-green-600"
                        type="submit">Lookup
                </button>
            </form>

            {
                result.error ? (
                    <div className="mt-3 text-red-400">{result.error}</div>
                ) : result.loading ? (
                    <ReactLoading type='bars' color="#dbdbdb" height={128} width={100} className="my-8 mx-auto"/>
                ) : result.data ? (
                    <div>
                        <div className="my-12 grid grid-cols-2 justify-items-center">
                            <div>
                                <div className="text-gray-400 text-xl mb-2">Server Name</div>
                                <div className="text-xl">{result.data.name}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xl mb-2">Online Members</div>
                                <div className="text-xl">{result.data.presence_count}</div>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-center mb-8">
                            {result.data.members.map(member => (
                                <div key={member.id} className="mr-3 mb-3 relative">
                                    <Tooltip title={member.username}>
                                        <img src={member.avatar_url} alt="avatar" className="w-12 h-12 rounded-full"/>
                                    </Tooltip>
                                    <div className="bg-dark-3 rounded-full p-0.5 absolute right-0 bottom-0">
                                        <div
                                            className={`w-3 h-3 rounded-full ${member.status === 'dnd' ? 'bg-red-500' : member.status === 'idle' ? 'bg-yellow-500' : 'bg-green-500'}`}/>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {result.data.instant_invite ? (
                            <div>
                                <div className="flex justify-center text-lg mb-2">
                                    <input type="text" className="px-3 py-2 rounded-l-md bg-dark-4 flex-auto"
                                           value={result.data.instant_invite} onChange={() => {
                                    }}/>
                                    <a className="block px-4 py-2 rounded-r-md bg-blue-400 hover:bg-blue-500"
                                       href={result.data.instant_invite} target="_blank">Join Server</a>
                                </div>
                                <div>
                                    <span className="text-yellow-300">Protip: </span>
                                    <span className="text-gray-400">You can use this invite in the Invite Resolver to get more information about the server!</span>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                ) : ''
            }
        </div>
    )
}