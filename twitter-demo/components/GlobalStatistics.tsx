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
                        <div className="w-full border-b py-6">
                            <h2 className="text-base">Sample Tweets for <span className="py-1 px-3 font-bold bg-blue-600 text-sm text-white align-middle rounded-full shadow-sm">positive</span> sentiment</h2>
                        </div>

                        {/*  */}
                        <div className="divide-y divide-gray-200 grid grid-flow-row gap-4">
                            {
                                _sentimentGroupedData[chosenSentiment].map(tweetId => (
                                    <TweetWithMetrics
                                        key={tweetId}
                                        tweetId={tweetId}
                                        output={data[tweetId]} />
                                ))
                            }
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            Click on a sentiment to get sample tweets
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
