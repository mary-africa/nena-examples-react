import Head from 'next/head'
import { Transition } from '@headlessui/react'
import { useCallback, useEffect, useState } from 'react'
import { getTweetByQueryItem, useSentiment } from '../utils/query'
import GlobalStatistics from '../components/GlobalStatistics'


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
            <span className="block max-w-full p-0.5 transform duration-200 ease-out bg-blue-500" style={{ width: `${progressValue * 100}%`}} />
        </Transition>
    )
}

interface HomeProps { 
    apiKey: string
    bearerToken: string
}


// const _data: SentimentData = {"1367064994601394200":{"chosen":"positive","dist":{"neutral":0.39143828127028735,"positive":0.7251958250999451,"negative":0.19492176262428984}},"1367041880588968000":{"chosen":"negative","dist":{"neutral":0.5258905743054736,"positive":0.20076581835746765,"negative":0.5696971291908994}},"1367032245609971700":{"chosen":"positive","dist":{"neutral":0.4925966290951086,"positive":0.6518808603286743,"negative":0.2429968152428046}},"1367029479282004000":{"chosen":"neutral","dist":{"neutral":0.6007831429694004,"positive":0.26256346702575684,"negative":0.5416236954624765}},"1365907736953835500":{"chosen":"positive","dist":{"neutral":0.3338188835186884,"positive":0.7569363713264465,"negative":0.1575190315488726}},"1366700014672748500":{"chosen":"positive","dist":{"neutral":0.1593067126426225,"positive":0.8667396306991577,"negative":0.057907685870304704}},"1366712891383160800":{"chosen":"neutral","dist":{"neutral":0.7877591933356598,"positive":0.4389517903327942,"negative":0.38426282233558595}},"1365960246066360300":{"chosen":"neutral","dist":{"neutral":0.7937364978715777,"positive":0.30695125460624695,"negative":0.35446745716035366}},"1364899693663256600":{"chosen":"positive","dist":{"neutral":0.3897036011524809,"positive":0.718253493309021,"negative":0.18589781469199806}}}

// const testTexts = {"1367064994601394200":"\"Watoto wote wa kike wanaosoma katika shule za Serikali watakaopata daraja la kwanza katika kipindi cha miaka mitan… https://t.co/YwIrbdzAjJ","1367041880588968000":"👉Ongezeka la haraka la watu\n👉utengenezaji wa ajira ni kidogo na hauko sawia\n👉kiwango duni cha elimu na ufinyu wa fu… https://t.co/lYHCPPfJuD","1367032245609971700":"Lazima Serikali zihakikishe usawa katika upatikanaji wa elimu isiyokuwa na ubaguzi.   #ArudiShule #ElimuBilaUbaguzi… https://t.co/emrJXm4xSI","1367029479282004000":"Wasichana wa vijijini wana uwezekano wa karibu mara mbili ya wale wa mijini wa kupata watoto kabla hawajafikia umri… https://t.co/DY4OhcFOLR","1365907736953835500":"Tulisema yalivuonunuliwa CASH haya madude hayato tengeneza FAIDA. Tukaitwa WASALITI! Msaliti kwa sababu tunakwambie… https://t.co/FVdmDwS7U2","1366700014672748500":"Elimu bure! Nyenyeeenyeee! Uchumi wa kati ! Sijui sisi matajiri! @wizara_elimuTz hii ni Shule ya Msingi Tindabuligi… https://t.co/zbvqhZE9nU","1366712891383160800":"Utafiti wa Kidemografia na Afya Tanzania ya mwaka 2015-16, unaonyesha Utoaji wa elimu sawa kwa watoto umekuwa ukiku… https://t.co/amGjyH4qNA","1365960246066360300":"Meko ni dikteta! Ni vyema watu wakajua tofauti ya reformist na mharibifu! Meko ni mharibifu na hajawahi kuwa reform… https://t.co/uGmX7HIGik","1364899693663256600":"Watoto wote wana haki ya kupata elimu, Tanzania tunabagua sana watoto wa kike.  #ArudiShule #ElimuBilaUbaguzi https://t.co/REqmNLm9wv"}

function SentimentDataView({ data, loading, comment }: any) {
    const show = Object.values(data).length !== 0

    return (
        <section className="w-full py-8">
            <div className="mx-auto container px-14">
                {/* loading animation */}
                <Transition
                    show={loading}
                    enter="transition transform duration-75 ease-in-out"
                    enterFrom="-translate-y-full opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition transform duration-75 ease-in-out"
                    leaveFrom="translate-y-0 opacity-100"
                    leaveTo="-translate-y-full opacity-0"
                    className="w-full inline-flex flex-row space-x-4 my-3 items-center">

                    {/* Ping animation */}
                    <span className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-400" />
                    </span>

                    {/* Loading Text */}
                    <span className="text-gray-400 text-2xl">
                        Processing Sentiments...
                    </span>
                </Transition>
                
                {/* Show the distribution of data */}

                <Transition
                    show={show && !loading}
                    enter="transition transform duration-75 ease-in-out"
                    enterFrom="-translate-y-full opacity-0"
                    enterTo="translate-y-0 opacity-100"
                    leave="transition transform duration-75 ease-in-out"
                    leaveFrom="translate-y-0 opacity-100"
                    leaveTo="-translate-y-full opacity-0"
                    className="w-full inline-flex flex-row space-x-4 my-3 items-center">
                        <GlobalStatistics data={data} />
                </Transition>
            </div>
        </section>
    )
}

function SentimentArea({ className, data, progress, loading }: any) {
    return (
        <div className={className}>
            <ProgressBar progressValue={progress} show={loading}/>
            <SentimentDataView data={data} loading={loading}/>
        </div>
    )
}


export default function Home(props: HomeProps) {
    const [q, set] = useState<string>("")
    const [data, setData, loading, progress, err] = useSentiment(props.apiKey)
    
    useEffect(() => {
        console.log(loading, progress)
        console.log("Data:", JSON.stringify(data))
    }, [loading])

    const performSearchQuery = useCallback(() => {
        console.log("Searching the information inputted...");
        // setData(testTexts)
        getTweetByQueryItem(props.bearerToken, q)
            .then(val => {
                // Building the text data
                const inputData: { [id: number]: string } = {}                
                val.statuses.forEach(_v => {
                    inputData[_v.id] = _v.text
                })

                console.log("Text data:", JSON.stringify(inputData))
                return setData(inputData)
            })
            .catch(err => console.error(err))
    }, [q])
    
    return (
        <>
            <Head>
                <title>Twitter Demo</title>
            </Head>
            <div className="h-screen w-full flex flex-col justify-between">
                <div className="w-full">
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
                    <SentimentArea className="border-t border-blue-300"
                        count={34}
                        data={data}
                        loading={loading}
                        progress={progress} />
                </div>
                <footer className="mx-auto container px-4 md:px-10 md:py-8">
                    <p className="text-gray-600">
                        Made with 
                        <span className="inline-flex justify-center items-center flex-row p-1">
                            <svg className="h-5 w-5 text-red-900" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </span>
                        by Mary.Africa
                    </p>
                </footer>
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
