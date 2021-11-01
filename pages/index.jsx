import React from 'react'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSnowflake} from "@fortawesome/free-regular-svg-icons";
import {faLink, faBuilding, faVial, faHeartbeat, faUser, faRobot, faAddressCard} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    return (
        <div>
            <div className="bg-dark-3 py-32 text-center mb-16 px-5">
                <h1 className="text-6xl font-bold mb-8">Discord Toolbox</h1>
                <div className="text-2xl text-gray-400 mb-8">Tools for all the fellow Discord power users and nerds out
                    there
                </div>
                <div className="flex flex-wrap justify-center">
                    <a href="https://wiki.distools.app" target="_blank"
                       className="block px-4 py-2 bg-dark-5 rounded-md text-xl mr-3 transform hover:scale-103 transition-transform">Wiki</a>
                    <a href="/discord" target="_blank"
                       className="block px-4 py-2 bg-blue-500 rounded-md text-xl transform hover:scale-103 transition-transform">Join
                        our Discord</a>
                </div>
            </div>
            <div className="flex justify-center px-3 md:px-5 mb-16">
                <div className="w-full xl:w-304">
                    <Link href="/lookup/snowflake" passHref>
                        <a className="block p-5 bg-dark-4 rounded-md transform hover:scale-101 transition-transform flex items-center mb-4">
                            <div
                                className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mr-4 text-4xl flex-shrink-0">
                                <FontAwesomeIcon icon={faSnowflake}/>
                            </div>
                            <div>
                                <div className="text-xl font-bold">Snowflake Decoder</div>
                                <div className="text-gray-400">Extract the creation date and more from a Discord ID
                                </div>
                            </div>
                        </a>
                    </Link>
                    <Link href="/lookup/user" passHref>
                        <a className="block p-5 bg-dark-4 rounded-md transform hover:scale-101 transition-transform flex items-center mb-4">
                            <div
                                className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mr-4 text-4xl flex-shrink-0">
                                <FontAwesomeIcon icon={faUser}/>
                            </div>
                            <div>
                                <div className="text-xl font-bold">User Lookup</div>
                                <div className="text-gray-400">Get information about a user from the user ID</div>
                            </div>
                        </a>
                    </Link>
                    <Link href="/lookup/guild" passHref>
                        <a className="block p-5 bg-dark-4 rounded-md transform hover:scale-101 transition-transform flex items-center mb-4">
                            <div
                                className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mr-4 text-4xl flex-shrink-0">
                                <FontAwesomeIcon icon={faBuilding}/>
                            </div>
                            <div>
                                <div className="text-xl font-bold">Server Lookup</div>
                                <div className="text-gray-400">Get information about a server from the server ID</div>
                            </div>
                        </a>
                    </Link>
                    <Link href="/lookup/invite" passHref>
                        <a className="block p-5 bg-dark-4 rounded-md transform hover:scale-101 transition-transform flex items-center mb-4">
                            <div
                                className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mr-4 text-4xl flex-shrink-0">
                                <FontAwesomeIcon icon={faLink}/>
                            </div>
                            <div>
                                <div className="text-xl font-bold">Invite Resolver</div>
                                <div className="text-gray-400">Extract information about a server and more from an
                                    invite
                                </div>
                            </div>
                        </a>
                    </Link>
                    <Link href="/lookup/app" passHref>
                        <a className="block p-5 bg-dark-4 rounded-md transform hover:scale-101 transition-transform flex items-center mb-4">
                            <div
                                className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mr-4 text-4xl flex-shrink-0">
                                <FontAwesomeIcon icon={faRobot}/>
                            </div>
                            <div>
                                <div className="text-xl font-bold">Application Lookup</div>
                                <div className="text-gray-400">Get information about a Discord application from the application ID </div>
                            </div>
                        </a>
                    </Link>
                    <Link href="/experiments" passHref>
                        <a className="block p-5 bg-dark-4 rounded-md transform hover:scale-101 transition-transform flex items-center mb-4">
                            <div
                                className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mr-4 text-4xl flex-shrink-0">
                                <FontAwesomeIcon icon={faVial}/>
                            </div>
                            <div>
                                <div className="text-xl font-bold">Client Experiments</div>
                                <div className="text-gray-400">View server and user specific client experiments</div>
                            </div>
                        </a>
                    </Link>
                    <Link href="/account" passHref>
                        <a className="block p-5 bg-dark-4 rounded-md transform hover:scale-101 transition-transform flex items-center mb-4">
                            <div
                                className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mr-4 text-4xl flex-shrink-0">
                                <FontAwesomeIcon icon={faAddressCard}/>
                            </div>
                            <div>
                                <div className="text-xl font-bold">Account Info</div>
                                <div className="text-gray-400">Get information about your Discord account and the servers you are in</div>
                            </div>
                        </a>
                    </Link>
                    <Link href="/status" passHref>
                        <a className="block p-5 bg-dark-4 rounded-md transform hover:scale-101 transition-transform flex items-center mb-4">
                            <div
                                className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center mr-4 text-4xl flex-shrink-0">
                                <FontAwesomeIcon icon={faHeartbeat}/>
                            </div>
                            <div>
                                <div className="text-xl font-bold">Discord Status</div>
                                <div className="text-gray-400">View the current discord status and some extra info</div>
                            </div>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}
