import murmurhash from "murmurhash/murmurhash";
import {apiRequest, guildIcon} from "../../util";
import React, {useState} from "react";
import Head from "next/head";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {PieChart, Pie, Tooltip as ReTooltip} from 'recharts'
import {useGuilds} from "../../hooks/guilds";
import {useRouter} from "next/router";

function bucketTitle({bucket}) {
    if (bucket === -1) {
        return 'None'
    } else if (bucket === 0) {
        return 'Control'
    } else {
        return `Treatment ${bucket}`
    }
}

export async function getServerSideProps({params}) {
    let experimentHash = params.eid
    if (!/^[0-9]+$/.exec(experimentHash)) {
        experimentHash = murmurhash.v3(experimentHash)
    }

    const metadata = await apiRequest(`/datamining/experiments/${experimentHash}`)
        .then(resp => resp.ok ? resp.json() : null)
        .catch(() => null)

    const rollout = await apiRequest(`/datamining/rollouts/${experimentHash}`)
        .then(resp => resp.ok ? resp.json() : null)
        .catch(() => null)

    return {
        props: {
            metadata: metadata,
            rollout: rollout
        },
        notFound: !metadata && !rollout
    }
}

export default function ExperimentDetails({metadata, rollout}) {
    const [selectedPopulation, setSelectedPopulation] = useState(0)
    const guilds = useGuilds()
    const router = useRouter()

    function getPopulations() {
        return rollout?.populations ?? []
    }

    function getPopulation() {
        return getPopulations()[selectedPopulation]
    }

    function filterList() {
        const population = getPopulation()
        if (!population || !population.filters.length) return ''

        function filterText(filter) {
            if (filter.type === 'member_count_range') {
                if (!filter.max) {
                    return `Server member count must be greater than or equal to ${filter.min}`
                } else if (!filter.min) {
                    return `Server member count must be lower than or equal to ${filter.max}`
                } else {
                    return `Server member count must be between ${filter.min} and ${filter.max}`
                }
            } else if (filter.type === 'guild_id_range') {
                return `Server ID must be between ${filter.min} and ${filter.max}`
            } else if (filter.type === 'guild_ids') {
                if (filter.ids.length === 1) {
                    return `Server ID must be: ${filter.ids[0]}`
                } else {
                    return `Server ID must be one of: ${filter.ids.join(', ')}`
                }
            } else if (filter.type === 'guild_features') {
                if (filter.features.length === 1) {
                    return `Server must have feature: ${filter.features[0]}`
                } else if (filter.features.length > 1) {
                    return `Server must have features: ${filter.features.join(', ')}`
                }
            }
        }

        return (
            <div>
                <div className="text-3xl font-bold">Filters</div>
                <div className="text-gray-400 mb-2 text-lg">These filters apply to all treatments</div>
                <div className="flex flex-wrap">
                    {population.filters.map((filter, i) => (
                        <div key={i}
                             className="px-2 py-1 bg-dark-5 rounded-md mb-2 mr-2 mb-2">{filterText(filter)}</div>
                    ))}
                </div>
            </div>
        )
    }

    function fullBuckets() {
        const buckets = {}

        const bucketColors = {
            '-1': '#FFECCC',
            '0': '#C8D6AF',
            '1': '#4D9DE0',
            '2': '#E15554',
            '3': '#44AF69',
            '4': '#FCAB10',
            '5': '#FCDC4D',
            '6': '#254E70'
        }

        if (metadata) {
            for (let bucket of metadata.buckets) {
                buckets[bucket.bucket] = {
                    title: bucket.title,
                    description: bucket.description,
                    bucket: bucket.bucket,
                    positions: [],
                    overrides: [],
                    color: bucketColors[bucket.bucket.toString()]
                }
            }
        }

        const population = getPopulation()
        if (population) {
            for (let bucket of population.buckets) {
                if (buckets.hasOwnProperty(bucket.bucket)) {
                    buckets[bucket.bucket].positions.push(...bucket.positions)
                } else {
                    buckets[bucket.bucket] = {
                        title: bucketTitle(bucket),
                        description: null,
                        bucket: bucket.bucket,
                        positions: bucket.positions,
                        overrides: [],
                        color: bucketColors[bucket.bucket.toString()]
                    }
                }
            }

            for (let [guild_id, bucket] of Object.entries(rollout.overrides)) {
                if (buckets.hasOwnProperty(bucket)) {
                    buckets[bucket].overrides.push(guild_id)
                } else {
                    buckets[bucket.bucket] = {
                        title: bucketTitle({bucket}),
                        description: null,
                        bucket: bucket,
                        positions: [],
                        overrides: [guild_id],
                        color: bucketColors[bucket.toString()]
                    }
                }
            }
        }

        if (!buckets[0]) {
            buckets[0] = {
                title: bucketTitle({bucket: 0}),
                description: null,
                bucket: 0,
                positions: [],
                overrides: [],
                color: bucketColors['0']
            }
        }

        if (!buckets[-1]) {
            buckets[-1] = {
                title: bucketTitle({bucket: -1}),
                description: null,
                bucket: -1,
                positions: [],
                overrides: [],
                color: bucketColors['-1']
            }
        }

        return Object.values(buckets).sort((a, b) => a.bucket > b.bucket ? 1 : 0)
    }

    function rolloutChartData() {
        const buckets = {}
        let total = 0

        fullBuckets().forEach(bucket => {
            let value = 0
            for (let position of bucket.positions) {
                value += position.end - position.start
            }

            total += value

            if (buckets.hasOwnProperty(bucket.bucket)) {
                buckets[bucket.bucket].value += value
            } else {
                buckets[bucket.bucket] = {
                    name: bucket.title,
                    value: value,
                    fill: bucket.color
                }
            }
        })

        if (total < 10000) {
            buckets[0].value += 10000 - total
        }

        return Object.values(buckets).filter(t => t.value > 0)
    }

    function guildsForBucket(bucket) {
        if (!guilds || !metadata) return []
        if (!bucket.positions || !bucket.positions.length) return []

        const population = getPopulation()
        return guilds.filter(g => {
            if (population && population.filters) {
                for (let filter of population.filters) {
                    switch (filter.type) {
                        case 'member_count_range':
                            // we don't have member count data
                            break;
                        case 'guild_id_range':
                            if (filter.min && g.id < filter.min) return false
                            if (filter.max && g.id > filter.max) return false
                            break;
                        case 'guild_ids':
                            if (!filter.ids.includes(g.id)) return false
                            break;
                        case 'guild_features':
                            for (let feature of filter.features) {
                                if (!g.features.includes(feature)) return false
                            }
                            break;
                    }
                }
            }

            const identifier = `${metadata.id}:${g.id}`
            const positionValue = murmurhash.v3(identifier) % 1e4

            for (let position of bucket.positions) {
                if (positionValue >= position.start && positionValue <= position.end) {
                    return true
                }
            }

            return false
        })
    }

    function guildsForBucketList(bucket) {
        const bucketGuilds = guildsForBucket(bucket)
        if (!bucketGuilds.length || !guilds) {
            return ''
        }

        let list
        if (bucketGuilds.length === guilds.length) {
            list = (
                <div className="flex">
                    <div className="px-2 py-1 bg-dark-5 rounded-md text-gray-300">All your servers have this treatment
                    </div>
                </div>
            )
        } else {
            list = (
                <div className="flex flex-wrap">
                    {bucketGuilds.map(guild => (
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
            )
        }

        return (
            <div className="mb-2">
                <div className="text-lg">Your Servers</div>
                <div className="text-gray-400 mb-2">Servers that you are in that have this treatment
                    (this does not consider member count filters)
                </div>
                {list}
            </div>
        )
    }

    return (
        <div className="my-16 flex justify-center px-3 md:px-5">
            <Head>
                <title>{metadata?.type === 'user' ? 'User Experiment' : 'Server Experiment'} | Discord Toolbox</title>
                <meta property="og:title" content={metadata?.id ?? rollout.hash}/>
                <meta property="og:type" content="profile"/>
                <meta property="og:site_name"
                      content={metadata?.type === 'user' ? 'User Experiment' : 'Server Experiment'}/>
                <meta property="og:description"
                      content=""/>
            </Head>

            <div className="w-full lg:w-256">
                <div className="flex flex-col md:flex-row md:items-end mb-5">
                    <div className="flex-auto mb-5 md:mb-0">
                        <h3 className="text-4xl font-bold mb-2">{metadata?.type === 'user' ? 'User Experiment' : 'Server Experiment'}</h3>
                        <div
                            className="text-gray-400 text-xl">{metadata?.id ?? rollout.hash} {metadata?.id ? `( ${metadata.hash} )` : ''}</div>
                    </div>
                    <div className="flex-initial">
                        {getPopulations().length > 1 ? (
                            <div className="flex items-center px-3 py-2 text-lg bg-dark-5 rounded-md">
                                <select value={selectedPopulation.toString()}
                                        onChange={e => setSelectedPopulation(parseInt(e.target.value))}
                                        className="bg-dark-5 mr-2 flex-auto">
                                    {getPopulations().map((_, i) => (
                                        <option value={i.toString()} key={i}>Population {i + 1}</option>
                                    ))}
                                </select>
                                <div className="text-gray-400">
                                    <FontAwesomeIcon icon={faChevronDown}/>
                                </div>
                            </div>
                        ) : ''}
                    </div>
                </div>
                {filterList() ? (
                    <div className="p-5 bg-dark-3 rounded-md mb-3">

                        {filterList()}
                    </div>
                ) : ''}

                <div className="p-5 bg-dark-3 rounded-md">
                    <div className="text-3xl font-bold">Treatments</div>
                    <div className="text-gray-400 mb-2 text-lg">Different versions of an experiment that can be
                        activated
                    </div>
                    {fullBuckets().map(bucket => (
                        <div className="mb-5" key={bucket.bucket}>
                            <div className="mb-1">
                                <span style={{color: bucket.color}}
                                      className="mr-3 text-2xl font-bold">{bucket.title}</span>
                                <span className="text-gray-400 text-normal">{bucket.description ?? ''}</span>
                            </div>
                            {bucket.positions.length ? (
                                <div className="mb-2">
                                    <div className="text-lg">Groups</div>
                                    <div className="text-gray-400 mb-2">The percentage of servers that have this
                                        treatment
                                    </div>
                                    <div className="flex flex-wrap">
                                        {bucket.positions.map((position, i) => (
                                            <div key={i} className="px-2 py-1 bg-dark-5 rounded-md mr-2 mb-2">
                                                {(position.end - position.start) / 100}%
                                                ({position.start} - {position.end})
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : ''}
                            {bucket.overrides.length ? (
                                <div className="mb-2">
                                    <div className="text-lg">Overrides</div>
                                    <div className="text-gray-400 mb-2">These servers have this treatment in all cases
                                    </div>
                                    <div className="flex flex-wrap mb-2">
                                        {bucket.overrides.map(override => (
                                            <a key={override} href={`/lookup/guild?guild_id=${override}`}
                                               target="_blank"
                                               className="px-2 py-1 bg-dark-5 rounded-md text-gray-300 mr-1 mb-1 text-sm">
                                                {override}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            ) : ''}
                            {guildsForBucketList(bucket)}
                        </div>
                    ))}
                    {rollout ? (
                        <div className="overflow-x-auto overflow-y-hidden">
                            <PieChart width={400} height={400} className="mx-auto -mb-16 -mt-5">
                                <Pie
                                    dataKey="value"
                                    data={rolloutChartData(fullBuckets())}
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
                    {metadata && metadata.type === 'guild' && !guilds && rollout ? (
                        <div className="mt-5">
                            <span className="text-yellow-300">Protip: </span>
                            <Link href="/login" passHref>
                                <a className="text-blue-300 hover:text-blue-400">Login </a>
                            </Link>
                            <span className="text-gray-400">with your Discord account to see which of your servers has this experiment.</span>
                        </div>
                    ) : ''}
                </div>
            </div>
        </div>
    )
}