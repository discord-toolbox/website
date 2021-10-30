import Head from "next/head";
import React from "react";
import VoiceLatency from "../../components/status/VoiceLatency";
import StagingStatus from "../../components/status/StagingStatus";
import Status from "../../components/status/Status";

export default function StatusTool() {
    return (
        <div className="mt-16 flex justify-center px-3 md:px-5">
            <Head>
                <title>Discord Status | Discord Toolbox</title>
            </Head>

            <div className="w-full lg:w-256">
                <h3 className="text-4xl font-bold mb-2">Discord Staging</h3>
                <div className="text-gray-400 text-xl mb-5">The current status of the one and only <a
                    href="https://staging.discord.co" target="_blank" className="text-blue-200">Discord Staging</a>
                </div>
                <div className="mb-16">
                    <StagingStatus/>
                </div>

                <h3 className="text-4xl font-bold mb-2">RTC Latency</h3>
                <div className="text-gray-400 text-xl mb-5">The RTC locations with the lowest latency for your location
                    (this is kinda pointless)
                </div>
                <div className="mb-16">
                    <VoiceLatency/>
                </div>
            </div>
        </div>
    )
}