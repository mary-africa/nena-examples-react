import { useState } from "react";
import PieChart from "./analytics/PieChart";
import NPNSentimentBars from "./SentimentBars";
const { TwitterTweetEmbed } = require('react-twitter-embed')

interface TweetWithMetricsProps {
    tweetId: string
    output: SentimentOutput<NPNLabelType>
    className?: string
}

function TweetWithMetrics({ tweetId, output, className }: TweetWithMetricsProps) {
    return (
        <div className={className}>
            <TwitterTweetEmbed
                tweetId={tweetId} />
            <NPNSentimentBars 
                labels={{negative: 'Negative', positive: 'Positive', neutral: 'Neutral'}}
                loading={false}
                sentiments={output['dist']} />
        </div>
    )
}


interface GlobalStatisticsProps {
    data: SentimentData
}

export default function GlobalStatistics({ data }: GlobalStatisticsProps) {    
    const ix = 0
    const tweetIds = Object.keys(data)

    const [chosenSentiment, setChosenSentiment] = useState<NPNLabelType | null>(null)

    const _sentimentGroupedData: { [id in NPNLabelType]: string[] } = {
        'negative': tweetIds.filter(x => data[x].chosen === 'negative'),
        'neutral': tweetIds.filter(x => data[x].chosen === 'neutral'),
        'positive': tweetIds.filter(x => data[x].chosen === 'positive'),
    }

    return (
        <section className="w-full flex flex-col md:flex-row gap-4 justify-start items-start">
            {/* left side with the overall statistics  */}
            <div>
                <PieChart 
                    width={300} 
                    height={300} 
                    onClickArc={(label: NPNLabelType) => setChosenSentiment(label)}
                    sentimentDataVals={{ 
                        negative: _sentimentGroupedData['negative'].length, 
                        neutral: _sentimentGroupedData['neutral'].length, 
                        positive: _sentimentGroupedData['positive'].length 
                    }}/>
            </div>

            {/* Right side with the specified statistics */}
            <div className="w-full">

            {
                chosenSentiment !== null ? (
                    <>
                        <div className="flex py-4 items-center">
                            <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            <p className="ml-4 text-gray-400">Sample tweets with <span className="capitalize">{chosenSentiment}</span> sentiments</p>
                        </div>

                        {/*  */}
                        <div className="divide-y divide-gray-200 grid grid-flow-row">
                            {
                                _sentimentGroupedData[chosenSentiment].map(tweetId => (
                                    <TweetWithMetrics
                                        className="py-2"
                                        key={tweetId}
                                        tweetId={tweetId}
                                        output={data[tweetId]} />
                                ))
                            }
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex py-4 items-center">
                            <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                            </svg>
                            <p className="ml-4 text-gray-400">Click on a sentiment to get sample tweets</p>
                        </div>
                        <div className="divide-y divide-gray-200 grid grid-flow-row">
                            {
                                tweetIds.map(tweetId => (
                                    <TweetWithMetrics
                                        className="py-2"
                                        key={tweetId}
                                        tweetId={tweetId}
                                        output={data[tweetId]} />                                    
                                ))
                            }
                        </div>
                    </>
                )
            }
            </div>
        </section>
    )
}
