import React from "react";
import Head from "next/head";
import ExperimentList from "../../components/experiments/ExperimentList";

export default function DataMiningTool() {
    return (
        <div className="mt-16 flex justify-center px-3 md:px-5">
            <Head>
                <title>Client Experiments | Discord Toolbox</title>
            </Head>

            <div className="w-full lg:w-256">
                <h3 className="text-4xl font-bold mb-2">Client Experiments</h3>
                <div className="text-gray-400 text-xl mb-5">Server and user specific client experiments</div>
                <div className="mb-16">
                    <ExperimentList/>
                </div>
            </div>
        </div>
    )
}