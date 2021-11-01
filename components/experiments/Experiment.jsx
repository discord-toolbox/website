import {useState, useEffect} from 'react'
import {apiRequest, guildIcon} from "../../util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp, faUser, faBuilding} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "../Tooltip";
import {PieChart, Pie, Tooltip as ReTooltip} from 'recharts'
import {useGuilds} from "../../hooks/guilds";
import Link from "next/link";
import {murmur3} from 'murmur-hash-js'

export default function Experiment({data}) {
    const [collapsed, setCollapsed] = useState(true)
    const [rollout, setRollout] = useState(null)

    const guilds = useGuilds()

    useEffect(() => {
        if (collapsed || rollout || data.type !== 'guild') return

        apiRequest(`/datamining/rollouts/${data.hash}`)
            .then(async resp => {
                if (resp.ok) {
                    setRollout(await resp.json())
                }
            })
    }, [collapsed])

    function filterList() {
        if (!rollout || !rollout.filters.length) return ''

        function filterText(filter) {
            if (filter.type === 'member_count') {
                if (!filter.max) {
                    return `Server member count must be greater than or equal to ${filter.min}`
                } else if (!filter.min) {
                    return `Server member count must be lower than or equal to ${filter.max}`
                } else {
                    return `Server member count must be between ${filter.min} and ${filter.max}`
                }
            } else if (filter.type === 'guild_id') {
                return `Server ID must be between ${filter.min} and ${filter.max}`
            } else if (filter.type === 'guild_features') {
                if (filter.features.length === 1) {
                    return `Server must have feature: ${filter.features[0]}`
                } else if (filter.features.length > 1) {
                    return `Server must have features: ${filter.features.join(', ')}`
                }
            }
        }

        return (
            <div className="mb-5">
                <div className="text-2xl font-bold">Filters</div>
                <div className="text-gray-400 mb-2 text-lg">These filters apply to all treatments</div>
                <div className="flex flex-wrap">
                    {rollout.filters.map((filter, i) => (
                        <div key={i} className="px-2 py-1 bg-dark-5 rounded-md mb-2">{filterText(filter)}</div>
                    ))}
                </div>
            </div>
        )
    }

    function fullTreatments() {
        const treatments = {}

        function treatmentTitle(treatment) {
            let title
            if (treatment.id === -1) {
                title = 'None'
            } else if (treatment.id === 0) {
                title = 'Control'
            } else {
                title = `Treatment ${treatment.id}`
            }
            return title
        }

        const treatmentColors = {
            '-1': '#FFECCC',
            '0': '#C8D6AF',
            '1': '#4D9DE0',
            '2': '#E15554',
            '3': '#44AF69',
            '4': '#FCAB10',
            '5': '#FCDC4D',
            '6': '#254E70'
        }

        for (let treatment of data.treatments) {
            treatments[treatment.id] = {
                title: treatmentTitle(treatment),
                label: treatment.label,
                id: treatment.id,
                groups: [],
                overrides: [],
                color: treatmentColors[treatment.id.toString()]
            }
        }

        if (rollout) {
            for (let treatment of rollout.treatments) {
                if (treatments.hasOwnProperty(treatment.id)) {
                    treatments[treatment.id].groups.push(...treatment.groups)
                    treatments[treatment.id].overrides.push(...treatment.overrides)
                } else {
                    treatments[treatment.id] = {
                        title: treatmentTitle(treatment),
                        label: null,
                        id: treatment.id,
                        groups: treatment.groups,
                        overrides: treatment.overrides,
                        color: treatmentColors[treatment.id.toString()]
                    }
                }
            }
        }

        for (let id of [-1, 0]) {
            if (!treatments.hasOwnProperty(id)) {
                treatments[id] = {
                    title: treatmentTitle({id}),
                    label: null,
                    id: id,
                    groups: [],
                    overrides: [],
                    color: treatmentColors[id]
                }
            }
        }

        return Object.values(treatments).sort((a, b) => a.id > b.id ? 1 : 0)
    }

    function rolloutChartData() {
        const treatments = {}
        let total = 0

        fullTreatments().forEach(treatment => {
            let value = 0
            for (let group of treatment.groups) {
                value += group.end - group.start
            }

            total += value

            if (treatments.hasOwnProperty(treatment.id)) {
                treatments[treatment.id].value += value
            } else {
                treatments[treatment.id] = {
                    name: treatment.title,
                    value: value,
                    fill: treatment.color
                }
            }
        })

        if (total < 10000) {
            treatments[0].value += 10000 - total
        }

        return Object.values(treatments).filter(t => t.value > 0)
    }

    function guildsForTreatment(treatment) {
        if (!guilds) return []
        if (!treatment.groups || !treatment.groups.length) return []

        return guilds.filter(g => {
            const identifier = `${data.id}:${g.id}`
            const groupValue = murmur3(identifier) % 1e4

            for (let group of treatment.groups) {
                if (groupValue >= group.start && groupValue <= group.end) {
                    return true
                }
            }

            return false
        })
    }

    return (
        <div className="pr-8 p-5 bg-dark-3 rounded-md mb-3">
            <div className="flex items-center cursor-pointer" onClick={() => setCollapsed(!collapsed)}>
                <div
                    className={`flex-initial text-4xl mr-5 ${data.type === 'guild' ? 'text-blue-300' : 'text-red-300'}`}>
                    <Tooltip title={data.type === 'guild' ? 'Server Experiment' : 'User Experiment'}>
                        <FontAwesomeIcon icon={data.type === 'guild' ? faBuilding : faUser}/>
                    </Tooltip>
                </div>
                <div className="flex-auto overflow-hidden">
                    <div className="text-xl">{data.label}</div>
                    <div className="text-gray-500 truncate">{data.id}</div>
                </div>
                <div className="flex-initial text-2xl">
                    <FontAwesomeIcon icon={collapsed ? faChevronDown : faChevronUp}/>
                </div>
            </div>
            {!collapsed ? (
                <div className="mt-5">
                    {filterList()}

                    <div className="text-2xl font-bold">Treatments</div>
                    <div className="text-gray-400 mb-2 text-lg">Different versions of an experiment that can be activated</div>
                    {fullTreatments().map(treatmet => (
                        <div className="mb-5" key={treatmet.id}>
                            <div className="mb-1">
                                <span style={{color: treatmet.color}}
                                      className="mr-3 text-xl font-bold">{treatmet.title}</span>
                                <span className="text-gray-400 text-normal">{treatmet.label}</span>
                            </div>
                            {treatmet.groups.length ? (
                                <div className="mb-2">
                                    <div className="text-lg">Groups</div>
                                    <div className="text-gray-400 mb-2">The percentage of servers that have this
                                        treatment
                                    </div>
                                    <div className="flex flex-wrap">
                                        {treatmet.groups.map((group, i) => (
                                            <div key={i} className="px-2 py-1 bg-dark-5 rounded-md mr-2 mb-2">
                                                {(group.end - group.start) / 100}% ({group.start} - {group.end})
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : ''}
                            {treatmet.overrides.length ? (
                                <div className="mb-2">
                                    <div className="text-lg">Overrides</div>
                                    <div className="text-gray-400 mb-2">These servers have this treatment in all cases
                                    </div>
                                    <div className="flex flex-wrap mb-2">
                                        {treatmet.overrides.map(override => (
                                            <a key={override} href={`/lookup/guild?guild_id=${override}`}
                                               target="_blank"
                                               className="px-2 py-1 bg-dark-5 rounded-md text-gray-300 mr-1 mb-1 text-sm">
                                                {override}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ) : ''}
                            {guildsForTreatment(treatmet).length ? (
                                <div className="mb-2">
                                    <div className="text-lg">Your Servers</div>
                                    <div className="text-gray-400 mb-2">Servers that you are in that have this treatment
                                        (this does not consider experiment filters)
                                    </div>
                                    <div className="flex flex-wrap">
                                        {guildsForTreatment(treatmet).map(guild => (
                                            <a key={guild.id} href={`/lookup/guild?guild_id=${guild.id}`}
                                               target="_blank"
                                               className="pl-1 pr-2 py-1 bg-dark-5 rounded-md text-gray-300 mr-1 mb-1 text-sm flex items-center overflow-hidden">
                                                <div className="flex-shrink-0">
                                                    <img src={guildIcon(guild, {size: 128})} alt="icon"
                                                         className="w-6 h-6 rounded-full mr-1"/>
                                                </div>
                                                <div className="truncate">{guild.name}</div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ) : ''}
                        </div>
                    ))}
                    {rollout ? (
                        <div className="overflow-x-auto overflow-y-hidden">
                            <PieChart width={400} height={400} className="mx-auto -mb-16 -mt-5">
                                <Pie
                                    dataKey="value"
                                    data={rolloutChartData()}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label={p => p.name}
                                />
                                <ReTooltip/>
                            </PieChart>
                        </div>
                    ) : ''}
                    {data.type === 'guild' && !guilds ? (
                        <div className="mt-5">
                            <span className="text-yellow-300">Protip: </span>
                            <Link href="/login" passHref>
                                <a className="text-blue-300 hover:text-blue-400">Login </a>
                            </Link>
                            <span className="text-gray-400">with your Discord account to see which of your servers has this experiment.</span>
                        </div>
                    ) : ''}
                </div>
            ) : ''}
        </div>
    )
}