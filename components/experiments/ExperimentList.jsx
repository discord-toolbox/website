import {useState, useEffect} from 'react'
import {apiRequest} from "../../util";
import ReactLoading from "react-loading";
import Experiment from "./Experiment";

export default function ExperimentList() {
    const [experiments, setExperiments] = useState(null)
    const [error, setError] = useState(false)
    const [search, setSearch] = useState('')

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

    if (error) {
        return <div className="text-xl text-red-400">Failed to load experiments :(</div>
    }

    if (!experiments) {
        return <ReactLoading type='bars' color="#dbdbdb" height={128} width={100} className="my-8 mx-auto"/>
    }

    function filteredExperiments() {
        return experiments
            .filter(e => e.label.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => b.id.localeCompare(a.id))
    }

    return (
        <div>
            <input type="text" className="px-3 py-2 text-lg bg-dark-4 rounded-md mb-4 w-full" placeholder="Search ..."
                   value={search} onChange={e => setSearch(e.target.value)}/>
            {filteredExperiments().map(experiment => (
                <Experiment data={experiment} key={experiment.hash}/>
            ))}
        </div>
    )
}