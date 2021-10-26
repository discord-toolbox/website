import React from 'react'
import Link from "next/link";

export default function Home() {
    return (
        <div>
            <div className="bg-dark-3 py-32 text-center mb-16">
                <h1 className="text-6xl font-bold mb-8">Discord Toolkit</h1>
                <div className="text-2xl text-gray-400 mb-8">For Discord power users</div>
                <div className="flex justify-center">
                    <a href="/docs"
                       className="block px-4 py-2 bg-dark-5 rounded-md text-xl mr-3 transform hover:scale-103 transition-transform">Documentation</a>
                    <a href="/discord"
                       className="block px-4 py-2 bg-blue-500 rounded-md text-xl transform hover:scale-103 transition-transform">Join
                        our Discord</a>
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full xl:w-304">
                    <Link href="/lookup" passHref>
                        <a className="block p-5 bg-dark-4 rounded-md transform hover:scale-102 transition-transform">

                        </a>
                    </Link>
                </div>
            </div>
        </div>
    )
}
