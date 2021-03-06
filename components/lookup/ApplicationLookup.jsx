import {useState, useEffect} from 'react'
import ReactLoading from "react-loading";
import {applicationIcon, hasBitFlag} from "../../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";
import app from "../../pages/lookup/app";


export default function ApplicationLookup() {
    const [appId, setAppId] = useState('')
    const [result, setResult] = useState({})

    const router = useRouter()

    useEffect(() => {
        if (!router.isReady) return
        if (router.query.app_id && !appId) {
            setAppId(router.query.app_id)
            lookupApplication(router.query.app_id)
        }
    }, [router])

    function lookupApplication(newAppId) {
        if (!newAppId) return

        setResult({loading: true})
        fetch(`https://discord.com/api/applications/${newAppId}/rpc`)
            .then(async resp => {
                if (!resp.ok) {
                    setResult({error: 'The application doesn\'t seem to exist.'})
                } else {
                    setResult({data: await resp.json()})
                }
            })
    }

    function handleInput(e) {
        setAppId(e.target.value.replace(/\D/g, '').trim())
    }

    function appDescription() {
        if (result.data.description && result.data.description.length) {
            return result.data.description
        }

        if (result.data.summary && result.data.summary.length) {
            return result.data.summary
        }


        return 'No description'
    }

    return (
        <div className="bg-dark-3 p-5 rounded-md">
            <div className="text-lg text-gray-300 mb-5">Please enter a valid Discord application ID below to look it up.
                The application ID is usually the same as the user id of the bot.
            </div>
            <form className="flex flex-col md:flex-row text-xl" onSubmit={e => {
                e.preventDefault();
                lookupApplication(appId);
            }}>
                <input type="text"
                       className="px-3 py-2 rounded-md bg-dark-4 placeholder-gray-500 flex-grow mb-3 md:mb-0 md:mr-3"
                       placeholder="416358583220043796" value={appId}
                       onChange={handleInput}/>
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
                    <div className="my-10">
                        <div className="flex justify-center mb-8">
                            <div className="flex-shrink-0 mr-4">
                                <img src={applicationIcon(result.data, {size: 128})} alt=""
                                     className="w-20 h-20 rounded-full bg-dark-4"/>
                            </div>
                            <div className="max-w-lg">
                                <div className="text-2xl">{result.data.name}</div>
                                <div className="text-gray-400">{appDescription()}</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:justify-items-center">
                            <div>
                                <div className="text-xl font-bold mb-1">Bot Info</div>
                                <div className="flex text-lg">
                                    <div
                                        className={`mr-2 ${result.data.bot_public ? 'text-green-400' : 'text-red-400'}`}>
                                        <FontAwesomeIcon icon={result.data.bot_public ? faCheckCircle : faTimesCircle}/>
                                    </div>
                                    <div className="text-gray-300">Public Bot</div>
                                </div>
                                <div className="flex text-lg">
                                    <div
                                        className={`mr-2 ${result.data.bot_require_code_grant ? 'text-green-400' : 'text-red-400'}`}>
                                        <FontAwesomeIcon
                                            icon={result.data.bot_require_code_grant ? faCheckCircle : faTimesCircle}/>
                                    </div>
                                    <div className="text-gray-300">Requires Code Grant</div>
                                </div>
                                <div className="flex text-lg">
                                    <div
                                        className={`mr-2 ${hasBitFlag(result.data.flags, 12) ? 'text-green-400' : 'text-red-400'}`}>
                                        <FontAwesomeIcon
                                            icon={hasBitFlag(result.data.flags, 12) ? faCheckCircle : faTimesCircle}/>
                                    </div>
                                    <div className="text-gray-300">Presence Intent</div>
                                </div>
                                <div className="flex text-lg">
                                    <div
                                        className={`mr-2 ${hasBitFlag(result.data.flags, 14) ? 'text-green-400' : 'text-red-400'}`}>
                                        <FontAwesomeIcon
                                            icon={hasBitFlag(result.data.flags, 14) ? faCheckCircle : faTimesCircle}/>
                                    </div>
                                    <div className="text-gray-300">Server Members Intent</div>
                                </div>
                                <div className="flex text-lg">
                                    <div
                                        className={`mr-2 ${hasBitFlag(result.data.flags, 18) ? 'text-green-400' : 'text-red-400'}`}>
                                        <FontAwesomeIcon
                                            icon={hasBitFlag(result.data.flags, 18) ? faCheckCircle : faTimesCircle}/>
                                    </div>
                                    <div className="text-gray-300">Message Content Intent</div>
                                </div>
                            </div>
                            <div>
                                <div className="text-xl font-bold mb-1">Policies</div>
                                <div className="text-lg">
                                    {result.data.terms_of_service_url ? (
                                        <div>
                                            <a href={result.data.terms_of_service_url} target="_blank"
                                               className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                                        </div>
                                    ) : ''}
                                    {result.data.privacy_policy_url ? (
                                        <div>
                                            <a href={result.data.privacy_policy_url} target="_blank"
                                               className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                                        </div>
                                    ) : ''}
                                    {!result.data.terms_of_service_url && !result.data.privacy_policy_url ? (
                                        <div>-</div>
                                    ) : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ''
            }
        </div>
    )
}