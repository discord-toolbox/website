import React from "react";
import Head from "next/head";
import ExperimentList from "../../components/experiments/ExperimentList";
import Link from "next/link";

export default function ExperimentsTool() {
    return (
        <div className="mt-16 flex justify-center px-3 md:px-5">
            <Head>
                <title>Client Experiments | Discord Toolbox</title>
            </Head>

            <div className="w-full lg:w-256">
                <div className="flex items-end flex-wrap">
                    <div className="flex-auto mb-5">
                        <h3 className="text-4xl font-bold mb-2">Client Experiments</h3>
                        <div className="text-gray-400 text-xl">Server and user specific client experiments</div>
                    </div>
                    <div className="mb-5">
                        <Link href="/experiments/raw" passHref>
                            <a className="px-3 py-2 bg-dark-4 rounded-md text-xl whitespace-nowrap">Raw Rollouts</a>
                        </Link>
                    </div>
                </div>
                <div className="mb-16">
                    <ExperimentList/>
                </div>
            </div>
        </div>
    )
}