import Link from "next/link";
import Head from "next/head";

export default function Custom404() {
    return (
        <div className="my-20 px-5 text-center">
            <Head>
                <title>Not Found | Discord Toolbox</title>
            </Head>
            <div className="text-4xl font-bold mb-5">404 - Page Not Found</div>
            <div className="text-xl text-gray-300 mb-10">Seems like you got lost, click below to get back home.</div>
            <Link href="/" passHref>
                <a className="bg-blue-500 px-5 py-2 rounded-md text-xl hover:bg-blue-600">Go Back</a>
            </Link>
        </div>
    )
}