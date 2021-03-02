import Head from 'next/head'
import { Transition } from '@headlessui/react'
import { useState } from 'react'
import { getNPNSentiment, getTweetByQueryItem } from '../utils/query'


function TwitterLogo(props: any) {
    return (
        <svg {...props} viewBox="0 0 256 209" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
            <path d="M256,25.4500259 C246.580841,29.6272672 236.458451,32.4504868 225.834156,33.7202333 C236.678503,27.2198053 245.00583,16.9269929 248.927437,4.66307685 C238.779765,10.6812633 227.539325,15.0523376 215.57599,17.408298 C205.994835,7.2006971 192.34506,0.822 177.239197,0.822 C148.232605,0.822 124.716076,24.3375931 124.716076,53.3423116 C124.716076,57.4586875 125.181462,61.4673784 126.076652,65.3112644 C82.4258385,63.1210453 43.7257252,42.211429 17.821398,10.4359288 C13.3005011,18.1929938 10.710443,27.2151234 10.710443,36.8402889 C10.710443,55.061526 19.9835254,71.1374907 34.0762135,80.5557137 C25.4660961,80.2832239 17.3681846,77.9207088 10.2862577,73.9869292 C10.2825122,74.2060448 10.2825122,74.4260967 10.2825122,74.647085 C10.2825122,100.094453 28.3867003,121.322443 52.413563,126.14673 C48.0059695,127.347184 43.3661509,127.988612 38.5755734,127.988612 C35.1914554,127.988612 31.9009766,127.659938 28.694773,127.046602 C35.3777973,147.913145 54.7742053,163.097665 77.7569918,163.52185 C59.7820257,177.607983 37.1354036,186.004604 12.5289147,186.004604 C8.28987161,186.004604 4.10888474,185.75646 0,185.271409 C23.2431033,200.173139 50.8507261,208.867532 80.5109185,208.867532 C177.116529,208.867532 229.943977,128.836982 229.943977,59.4326002 C229.943977,57.1552968 229.893412,54.8901664 229.792282,52.6381454 C240.053257,45.2331635 248.958338,35.9825545 256,25.4500259" fill="#55acee"></path>
        </svg>
    )
}

// adding the type for base sentiment prediction
type DistributionProps<LabelType extends string> = {
    [type in LabelType]: number
}

/**
 * Component that renders the output of the sentiment predictions
 * @param props 
 */
function NPNDistribution(props: DistributionProps<NPNLabelType>) {
    return (
        <>
            {
                Object.keys(props).map(key => (
                    <div key={key}>
                        <label className="text-xl font-bold capitalize">{key}</label>
                        <label>{Math.round(props[key] * 100)}</label>
                    </div>
                ))
            }
        </>
    )
}

function ProgressBar ({ progressValue, show }: any) { 
    return (
        <Transition
            show={Boolean(show || false)}
            enter="transition transform duration-75 ease-in"
            enterFrom="opacity-0 -translate-y-full"
            enterTo="opacity-100 translate-y-0"
            leave="transition transform duration-75 ease-out"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-full"
            className="w-full">
            <span className="block max-w-full p-0.5 translate transition duration-100 ease-in-out bg-red-500" style={{ width: `${progressValue * 100}%`}} />
        </Transition>
    )
}

interface HomeProps { 
    apiKey: string
    bearerToken: string
}

export default function Home(props: HomeProps) {
    const [q, set] = useState<string>("")

    const performSearchQuery = (() => {
        console.log("Searching the information inputted")
        getTweetByQueryItem(props.bearerToken, q)
            .then(val => console.log(val))
            .catch(err => console.error(err))
            .finally(() => {
                getNPNSentiment(props.apiKey, [
                    "mimi ni mzembe",
                    "mimi ni mzuri",
                    "nakupenda",
                    "acha ujinga"
                ])
                .then(val => console.log(val))
                .catch(err => console.error(err))
            })
        
    })
    
    return (
        <>
            <Head>
                <title>Twitter Demo</title>
            </Head>
            <div className="h-screen w-full">
                {/* Header */}
                <div className="bg-blue-50 py-10 ">
                    <div className="mx-auto container">
                        {/* Title */}
                        <span className="inline-flex justify-start items-start gap-4">
                            <TwitterLogo className="h-10 w-10"/>
                            <span className="inline-block space-y-4">
                                <h1 className="font-bold text-3xl">Twitter Demo</h1>
                                <label className="text-gray-600">Using Nena Sentiment Service</label>
                            </span>
                        </span>
                        {/* API Input */}
                        {/* <div className="grid grid-cols-2 gap-10 mt-8 mx-14">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Please include  the API Key</label>
                                <ProtectedField value={apiKey} onChange={(e) => setApiKey(e.target.value)} errShow={false} />
                            </div>
                        </div> */}
                        {/* Twitter content search */}
                        <div className="grid grid-cols-2 gap-10 mt-8 mx-14">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Type in the twitter hashtag</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 flex items-center pr-2 pl-3">
                                        {/* search icon */}
                                        <svg className="h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </span>
                                    <input 
                                        value={q}
                                        onChange={e => set(e.target.value)}
                                        className="focus:outline-none block w-full py-2 pl-10 sm:text-smtransition rounded-md border shadow-sm duration-100 ease-linear" placeholder="example: #ElimikaWikiendi" />
                                </div>
                            </div>
                        </div>
                         {/* Searching your entry */}
                        <div className="grid grid-cols-3 gap-10 mt-8 mx-14">
                            <button 
                                onClick={performSearchQuery}
                                type="button" 
                                className="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Search Query
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="border-t border-blue-300">
                    <ProgressBar progressValue={0.334} show/>
                    <div className="mx-auto container py-10 px-10">
                        {/* <div className="flex flex-row gap-4">
                            <div className="space-y-4">
                            </div>

                            <aside className="space-y-4">
                                <div>Obtained <b>34</b> tweets on <b>#elimu-tanzania</b></div>

                                <div className="shadow-md rounded-xl border">
                                    <AnalyticalGraph width={590} height={400} />
                                </div>
                            </aside>
                        </div> */}
                        {/* Building the results rendered */}
                        <div className="">
                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    return {
        props: { 
            apiKey: process.env.NENA_PLAYGROUND_API_KEY,
            bearerToken: process.env.TWITTER_BEARER_TOKEN
        } as HomeProps
    }
}
