import React from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {useUser} from "../hooks/user";
import {useState} from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

export default function NavBar() {
    const router = useRouter()
    const user = useUser()

    const [toolsOpen, setToolsOpen] = useState(false)

    function isPathActive(path) {
        return router.pathname.startsWith(path)
    }

    return (
        <div>
            <div className="fixed w-screen top-0 right-0 left-0 bg-gray-100 bg-dark-3 z-50">
                <div className="h-22 flex items-center justify-center px-5">
                    <div className="flex w-full xl:w-304">
                        <div className="flex-initial mr-8">
                            <Link href="/" passHref>
                                <a>
                                    <img src="/tools.svg" alt=""
                                         className="h-12 w-12 transform hover:scale-105 transition-transform"/>
                                </a>
                            </Link>
                        </div>
                        <div className="flex flex-auto items-center relative text-gray-300" onClick={() => setToolsOpen(!toolsOpen)}>
                            <button className="text-xl lg:hidden flex items-center">
                                <div className="mr-2">Tools</div>
                                <div className="text-lg">
                                    <FontAwesomeIcon icon={toolsOpen ? faChevronUp : faChevronDown}/>
                                </div>
                            </button>
                            <div className={`flex-auto flex flex-col lg:flex-row lg:items-center absolute lg:static left-0 top-12 bg-dark-5 lg:bg-transparent px-3 py-2 lg:p-0 space-y-2 lg:space-y-0 rounded-md ${toolsOpen ? 'block' : 'hidden lg:block'}`}>
                                <Link href="/lookup" passHref>
                                    <a className={`text-xl mr-8 hover:text-blue-400 ${isPathActive('/lookup') ? 'text-blue-400' : ''}`}>Lookup</a>
                                </Link>
                                <Link href="/experiments" passHref>
                                    <a className={`text-xl mr-8 hover:text-blue-400 ${isPathActive('/experiments') ? 'text-blue-400' : ''}`}>Experiments</a>
                                </Link>
                                <Link href="/status" passHref>
                                    <a className={`text-xl mr-8 hover:text-blue-400 ${isPathActive('/status') ? 'text-blue-400' : ''}`}>Status</a>
                                </Link>
                            </div>
                        </div>
                        <div className="flex-initial flex items-center text-gray-100 hidden md:flex">
                            <a href="/docs"
                               className="block px-5 py-2 text-xl bg-dark-5 rounded-md transform hover:scale-103 transition-transform mr-3">Docs</a>
                            <a href="/discord" target="_blank"
                               className="block px-5 py-2 text-xl bg-blue-500 rounded-md transform hover:scale-103 transition-transform">Discord</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pb-22 bg-dark-3"/>
        </div>
    )
}