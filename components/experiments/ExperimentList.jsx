import {useState, useEffect} from 'react'
import {apiRequest, formatTimestamp} from "../../util";
import ReactLoading from "react-loading";
import {useRouter} from "next/router";
import Tooltip from "../Tooltip";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBuilding, faUser} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function ExperimentList() {
    const [experiments, setExperiments] = useState(null)
    const [error, setError] = useState(false)

    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('all')
    const router = useRouter()

    useEffect(() => {
        apiRequest('/datamining/experiments')
            .then(async resp => {
                if (!resp.ok) {
                    setError(true)
                } else {
                    setExperiments(await resp.json())
                }
            })
    }, [])

    useEffect(() => {
        if (!router.isReady) return
        if (router.query.s && !search) {
            setSearch(router.query.s)
        }
        if (router.query.t && typeFilter === 'all') {
            setTypeFilter(router.query.t)
        }
    }, [router])

    function updateQuery(newSearch, newTypeFilter) {
        router.push({
            pathname: '/experiments',
            query: {s: newSearch, t: newTypeFilter},
        }, undefined, {shallow: true})
    }

    function handleSearchChange(e) {
        setSearch(e.target.value)
        updateQuery(e.target.value, typeFilter)
    }

    function handleTypeFilterChange(e) {
        setTypeFilter(e.target.value)
        updateQuery(search, e.target.value)
    }

    function filteredExperiments() {
        return experiments
            .filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()))
            .filter(e => typeFilter === 'all' || e.type === typeFilter)
            .sort((a, b) => a.updated_at < b.updated_at)
    }

    if (error) {
        return <div className="text-xl text-red-400">Failed to load experiments :(</div>
    }

    if (!experiments) {
        return <ReactLoading type='bars' color="#dbdbdb" height={128} width={100} className="my-8 mx-auto"/>
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row mb-4">
                <input type="text" className="px-3 py-2 text-lg bg-dark-4 rounded-md flex-auto mb-2 md:mb-0 md:mr-2"
                       placeholder="Search ..."
                       value={search} onChange={handleSearchChange}/>
                <select className="px-3 py-2 text-lg bg-dark-4 rounded-md flex-initial" value={typeFilter}
                        onChange={handleTypeFilterChange}>
                    <option value="all">Show All</option>
                    <option value="guild">Server</option>
                    <option value="user">User</option>
                </select>
            </div>
            {filteredExperiments().map(experiment => (
                <Link key={experiment.hash} href={`/experiments/${experiment.hash}`} passHref>
                    <a className="p-5 block bg-dark-3 rounded-md mb-3 transform hover:scale-101 transition-transform">
                        <div className="flex items-center cursor-pointer">
                            <div
                                className={`flex-initial text-4xl mr-5 ${experiment.type === 'guild' ? 'text-blue-300' : 'text-red-300'}`}>
                                <Tooltip title={experiment.type === 'guild' ? 'Server Experiment' : 'User Experiment'}>
                                    <FontAwesomeIcon icon={experiment.type === 'guild' ? faBuilding : faUser}/>
                                </Tooltip>
                            </div>
                            <div className="flex-auto overflow-hidden">
                                <div className="text-xl">{experiment.title}</div>
                                <div className="text-gray-500 truncate">{experiment.id}</div>
                            </div>
                            {experiment.updated_at ? (
                                <div className="flex-initial flex-shrink-0 text-lg text-gray-400 hidden md:block">
                                    {formatTimestamp(experiment.updated_at)}
                                </div>
                            ) : ''}
                        </div>
                    </a>
                </Link>
            ))}
        </div>
    )
}