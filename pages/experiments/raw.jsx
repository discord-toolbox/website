import RawRolloutList from "../../components/experiments/RawRolloutList";
import Head from "next/head";
import React from "react";
import Link from "next/link";

export default function RawExperimentsTool() {
    return (
        <div className="mt-16 flex justify-center px-3 md:px-5">
            <Head>
                <title>Raw Experiment Rollouts | Discord Toolbox</title>
            </Head>

            <div className="w-full lg:w-256">
                <div className="flex items-end flex-wrap">
                    <div className="flex-auto mb-5">
                        <h3 className="text-4xl font-bold mb-2">Raw Experiment Rollouts</h3>
                        <div className="text-gray-400 text-xl">Rollout data for server specific client experiments without metadata</div>
                    </div>
                    <div className="mb-5">
                        <Link href="/experiments" passHref>
                            <a className="px-3 py-2 bg-dark-4 rounded-md text-xl whitespace-nowrap">With Metadata</a>
                        </Link>
                    </div>
                </div>
                <div className="mb-16">
                    <RawRolloutList/>
                </div>
            </div>
        </div>
    )
}