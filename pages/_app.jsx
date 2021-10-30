import '../styles/globals.css'
import NavBar from "../components/NavBar";
import React from "react";
import Head from "next/head";
import {TokenProvider} from "../hooks/token";
import {UserProvider} from "../hooks/user";
import {GuildsProvider} from "../hooks/guilds";
import '@fortawesome/fontawesome-svg-core/styles.css'
import {useEffect} from 'react'

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

function MyApp({Component, pageProps}) {
    useEffect(() => {
        document.querySelector("body").classList.add("bg-dark-2")
    });

    return (
        <div>
            <Head>
                <title>Discord Toolbox</title>
                <meta name="description" content="Tools for all the fellow Discord power users and nerds out there"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <TokenProvider>
                <UserProvider>
                    <GuildsProvider>
                        <div className="flex flex-col min-h-screen">
                            <div className="flex-initial">
                                <NavBar/>
                            </div>
                            <div className="flex-auto bg-dark-2 text-gray-100">
                                <Component {...pageProps} />
                            </div>
                        </div>
                    </GuildsProvider>
                </UserProvider>
            </TokenProvider>
        </div>
    )
}

export default MyApp
