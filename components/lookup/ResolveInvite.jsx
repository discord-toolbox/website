import {useState} from 'react'
import ReactLoading from "react-loading";
import {guildIcon, userAvatar, formatDateTime} from "../../util";


export default function ResolveInvite() {
    const [invite, setInvite] = useState('')
    const [result, setResult] = useState({})

    function resolveInvite() {
        if (!invite) return

        const inviteId = invite
            .replace(/\/$/, '')
            .replace(/^\//, '')
            .split('/')
            .slice(-1)[0]

        setResult({loading: true})
        fetch(`https://discord.com/api/v8/invites/${inviteId}?with_counts=1&with_expiration=1`)
            .then(async resp => {
                if (!resp.ok) {
                    setResult({error: 'The invite is either invalid or has expired. Please make sure that you have entered it correctly!'})
                } else {
                    setResult({data: await resp.json()})
                }
            })
    }

    function guild() {
        if (!result.data) return null
        return result.data.guild
    }

    function guildDescription() {
        const guild = guild()
        if (!guild) return null

        if (guild.description) {
            return guild.description
        }

        if (guild.welcome_screen && guild.welcome_screen.description) {
            return guild.welcome_screen.description
        }

        return null
    }

    function inviter() {
        if (!result.data) return null
        return result.data.inviter
    }

    return (
        <div className="bg-dark-3 p-5 rounded-md">
            <div className="text-lg text-gray-300 mb-5">Please enter a valid Discord Invite below to resolve it. Discord
                invites usually start with <span className="text-yellow-300">discord.gg/</span>.
            </div>
            <form className="flex text-xl" onSubmit={e => {
                e.preventDefault();
                resolveInvite();
            }}>
                <input type="text" className="px-3 py-2 rounded-md bg-dark-4 placeholder-gray-500 flex-grow mr-3"
                       placeholder="discord.gg/5GmAsPs" value={invite}
                       onChange={e => setInvite(e.target.value.trim())}/>
                <button className="px-3 py-2 rounded-md bg-green-500 flex-initial hover:bg-green-600"
                        type="submit">Resolve
                </button>
            </form>

            {
                result.error ? (
                    <div className="mt-3 text-red-400">{result.error}</div>
                ) : result.loading ? (
                    <ReactLoading type='bars' color="#dbdbdb" height={128} width={100} className="my-8 mx-auto"/>
                ) : result.data ? (
                    <div className="mt-10">
                        <div className="flex justify-center mb-16">
                            <div className="flex items-center max-w-xl">
                                <img src={guildIcon(guild(), {size: 128})} alt=""
                                     className="rounded-full h-32 w-32 mr-5 bg-dark-4"/>
                                <div>
                                    <div className="text-3xl">{guild().name}</div>
                                    <div className="text-gray-500 mb-1">{guild().id}</div>
                                    <div className="text-gray-400">{guild().description}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-12 grid grid-cols-3 justify-items-center gap-5">
                            <div>
                                <div className="text-gray-400 text-xl mb-2">Vanity Code</div>
                                <div className="text-xl">{guild().vanity_url_code ?? '-'}</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xl mb-2">Members</div>
                                <div className="text-xl">
                                    <span>{result.data.approximate_presence_count}</span>
                                    <span className="text-gray-500"> / </span>
                                    <span>{result.data.approximate_member_count} </span>
                                    <span className="text-gray-400">online</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-xl mb-2">Invite Expires At</div>
                                <div className="text-xl">{result.data.expires_at ? formatDateTime(new Date(result.data.expires_at)) : '-'}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center mb-8">
                            {guild().features.map(feature => (
                                <div key={feature} className="mr-2 mb-2 px-2 bg-dark-5 rounded-md">
                                    {feature}
                                </div>
                            ))}
                        </div>

                        {inviter() ? (
                            <div className="flex justify-center">
                                <div className="bg-dark-4 pl-3 pr-8 py-2 rounded-full flex items-center">
                                    <img src={userAvatar(inviter(), {size: 128})} alt=""
                                         className="w-20 h-20 rounded-full bg-dark-5 mr-5"/>
                                    <div>
                                        <div className="text-xl">
                                            <span>{inviter().username}</span>
                                            <span className="text-gray-400">#</span>
                                            <span className="text-gray-400">{inviter().discriminator}</span>
                                        </div>
                                        <div className="text-gray-500">{inviter().id}</div>
                                    </div>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                ) : ''
            }
        </div>
    )
}