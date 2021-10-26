import React from "react";
import Head from "next/head";
import {useState} from 'react'
import SendMessage from "../../components/messages/SendMessage";

export default function MessageTool() {
    const [mode, setMode] = useState('webhook')

    return (
        <div className="flex justify-center my-10 px-3 md:px-5">
            <Head>
                <title>Message Tool | Discord Toolbox</title>
            </Head>

            <div className="w-full xl:w-304">
                <div className="mb-5">
                    <SendMessage mode={mode} modeChanged={setMode}/>
                </div>
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <div className="p-5 bg-dark-3 rounded-md">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}