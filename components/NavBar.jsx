import React from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import {useUser} from "../hooks/user";

export default function NavBar() {
    const router = useRouter()
    const user = useUser()

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
                        <div className="flex-auto flex items-center text-gray-300">
                            <Link href="/lookup" passHref>
                                <a className={`text-xl mr-8 hover:text-blue-400 ${isPathActive('/lookup') ? 'text-blue-400' : ''}`}>Lookup</a>
                            </Link>
                            <Link href="/experiments" passHref>
                                <a className={`text-xl mr-8 hover:text-blue-400 ${isPathActive('/experiments') ? 'text-blue-400' : ''}`}>Experiments</a>
                            </Link>
                        </div>
                        <div className="flex-initial flex items-center text-gray-100">
                            <Link href="/docs" passHref>
                                <a className="block px-5 py-2 text-xl bg-dark-5 rounded-md transform hover:scale-103 transition-transform mr-3">Docs</a>
                            </Link>
                            <Link href="/login" passHref>
                                <a className="block px-5 py-2 text-xl bg-blue-500 rounded-md transform hover:scale-103 transition-transform">Discord</a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pb-22 bg-dark-3"/>
        </div>
    )
}