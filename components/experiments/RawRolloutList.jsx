import React, {useEffect, useState} from "react";
import {apiRequest, formatTimestamp} from "../../util";
import {useRouter} from "next/router";
import ReactLoading from "react-loading";
import murmurhash from "murmurhash/murmurhash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faVial} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function RawRolloutList() {
    const [rollouts, setRollouts] = useState(null)
    const [error, setError] = useState(false)

    const [search, setSearch] = useState('')
    const router = useRouter()

    useEffect(() => {
        apiRequest('/datamining/rollouts')
            .then(async resp => {
                if (resp.ok) {
                    setRollouts(await resp.json())
                } else {
                    setError(true)
                }
            })
    }, [])

    useEffect(() => {
        if (!router.isReady) return
        if (router.query.s && !search) {
            setSearch(router.query.s)
        }
    }, [router])

    function updateQuery(newSearch) {
        router.push({
            pathname: '/experiments/raw',
            query: {s: newSearch},
        }, undefined, {shallow: true})
    }

    function handleSearchChange(e) {
        setSearch(e.target.value)
        updateQuery(e.target.value)
    }

    function filteredRollouts() {
        return rollouts
            .filter(rollout => {
                const trimmedSearch = search.trim()
                if (!trimmedSearch) return true

                if (/^[0-9]+$/.exec(trimmedSearch) && parseInt(trimmedSearch) === rollout.hash) {
                    return true
                } else {
                    console.log(murmurhash.v3(trimmedSearch))
                    return murmurhash.v3(trimmedSearch) === rollout.hash;
                }
            })
            .sort((a, b) => a.updated_at < b.updated_at)
    }

    if (error) {
        return <div className="text-xl text-red-400">Failed to load rollout data :(</div>
    }

    if (!rollouts) {
        return <ReactLoading type='bars' color="#dbdbdb" height={128} width={100} className="my-8 mx-auto"/>
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row mb-4">
                <input type="text" className="px-3 py-2 text-lg bg-dark-4 rounded-md flex-auto"
                       placeholder="Experiment ID or hash ..."
                       value={search} onChange={handleSearchChange}/>
            </div>
            {filteredRollouts().map(rollout => (
                <Link key={rollout.hash} href={`/experiments/${rollout.hash}`} passHref>
                    <a className="p-5 block bg-dark-3 rounded-md mb-3 transform hover:scale-101 transition-transform">
                        <div className="flex items-center cursor-pointer">
                            <div
                                className={`flex-initial text-4xl mr-5 text-red-300`}>
                                <FontAwesomeIcon icon={faVial}/>
                            </div>
                            <div className="flex-auto overflow-hidden">
                                <div className="text-xl">{rollout.hash}</div>
                                <div className="text-gray-500 truncate">{rollout.populations.length} Populations</div>
                            </div>
                            {rollout.updated_at ? (
                                <div className="flex-initial flex-shrink-0 text-lg text-gray-400 hidden md:block">
                                    {formatTimestamp(rollout.updated_at)}
                                </div>
                            ) : ''}
                        </div>
                    </a>
                </Link>
            ))}
        </div>
    )
}