import {useState, useEffect} from 'react'
import ReactLoading from "react-loading";
import Tooltip from "../Tooltip";
import {apiRequest, hasBitFlag, intToHexColor, userAvatar, userBanner, solveCaptcha, formatDateTime, snowlfakeTimestamp} from "../../util";
import {useRouter} from "next/router";


export const badges = {
    0: ['Discord Employee', 'staff.svg'],
    1: ['Partnered Server Owner', 'partner.svg'],
    2: ['HypeSquad Events', 'hypesquadevents.svg'],
    3: ['Bug Hunter', 'bughunter.svg'],
    6: ['HypeSquad Bravery', 'hypesquadbravery.svg'],
    7: ['HypeSquad Brilliance', 'hypesquadbrilliance.svg'],
    8: ['HypeSquad Balance', 'hypesquadbalance.svg'],
    9: ['Early Supporter', 'earlysupporter.svg'],
    14: ['Bug Hunter', 'bughunter2.svg'],
    17: ['Early Verified Bot Developer', 'verifiedbotdev.svg'],
    18: ['Discord Certified Moderator', 'certifiedmod.svg']
}


export default function UserLookup() {
    const [userId, setUserId] = useState('')
    const [result, setResult] = useState({})

    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) return
        if (router.query.user_id && !userId) {
            setUserId(router.query.user_id)
            lookupUser(router.query.user_id)
        }
    }, [router])

    function lookupUser(newUserId) {
        setResult({captcha: true})

        solveCaptcha().then(captchaSolution => {
            setResult({loading: true})

            apiRequest(
                `/lookup/users/${newUserId}`,
                {captcha: captchaSolution}
            )
                .then(async resp => {
                    if (!resp.ok) {
                        setResult({error: 'Failed to lookup this user, please try again later.'})
                    } else {
                        const data = await resp.json()
                        if (!data.exists) {
                            setResult({error: 'The user doesn\'t seem to exist.'})
                        } else {
                            setResult({data: data.data})
                        }
                    }
                })
        })
    }

    function handleInput(e) {
        setUserId(e.target.value.replace(/\D/g, '').trim())
    }

    function handleSubmit() {
        if (!userId) return
        lookupUser(userId)
    }

    return (
        <div className="bg-dark-3 p-5 rounded-md">
            <div className="text-lg text-gray-300 mb-5">Please enter a valid Discord user ID below to look it up. If
                you aren't sure how to obtain a
                Discord user ID please follow the instructions <a href="/docs" target="_blank"
                                                                  className="text-blue-400 hover:text-blue-300">here</a>.
            </div>
            <form className="flex flex-col md:flex-row text-xl" onSubmit={e => {
                e.preventDefault();
                handleSubmit();
            }}>
                <input type="text"
                       className="px-3 py-2 rounded-md bg-dark-4 placeholder-gray-500 flex-grow mb-3 md:mb-0 md:mr-3"
                       placeholder="386861188891279362" value={userId} onChange={handleInput}/>
                <button className="px-3 py-2 rounded-md bg-green-500 flex-initial hover:bg-green-600"
                        type="submit">Lookup
                </button>
            </form>

            {
                result.error ? (
                    <div className="mt-3 text-red-400">{result.error}</div>
                ) : result.loading ? (
                    <div className="flex flex-col items-center my-8">
                        <ReactLoading type='bars' color="#dbdbdb" height={128} width={100}/>
                        <div className="text-xl text-gray-300">Fetching information ...</div>
                    </div>
                ) : result.captcha ? (
                    <div className="flex flex-col items-center my-8">
                        <ReactLoading type='bars' color="#dbdbdb" height={128} width={100}/>
                        <div className="text-xl text-gray-300">Making sure you are not a robot ...</div>
                    </div>
                ) : result.data ? (
                    <div className="bg-dark-4 rounded-md pb-10">
                        <div className="bg-yellow-400 h-32 md:h-48 lg:h-64 rounded-t-md mt-5" style={{
                            backgroundColor: intToHexColor(result.data.accent_color),
                            backgroundImage: `url("${userBanner(result.data)}")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}/>
                        <div className="flex items-top px-5 mb-4">
                            <div className="-mt-14 md:-mt-20 p-2 bg-dark-4 rounded-full mr-4 flex-shrink-0">
                                <img src={userAvatar(result.data, {size: 128})} alt="avatar"
                                     className="rounded-full w-24 h-24 md:w-32 md:h-32"/>
                            </div>
                            <div className="flex flex-wrap pt-4">
                                {Object.keys(badges).map(bit => hasBitFlag(result.data.public_flags, bit) ? (
                                    <Tooltip title={badges[bit][0]} key={bit}>
                                        <img src={`/discord-badges/${badges[bit][1]}`} alt={badges[bit][0]}
                                             className="w-6 h-6 mr-2 mb-2"/>
                                    </Tooltip>
                                ) : '')}
                            </div>
                        </div>
                        <div className="px-5 text-2xl font-bold mb-6">
                            <span>{result.data.username}</span>
                            <span className="text-gray-400">#{result.data.discriminator}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 px-5 gap-8">
                            <div>
                                <div className="text-xl font-bold mb-2">Created At</div>
                                <div
                                    className="text-xl text-gray-300">{formatDateTime(snowlfakeTimestamp(result.data.id))}</div>
                            </div>
                        </div>
                    </div>
                ) : ''
            }
        </div>
    )
}