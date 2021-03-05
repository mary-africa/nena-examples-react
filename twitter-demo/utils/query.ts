/**
 * Utility functions used accros the app
 */

import axios from 'axios';
import produce from 'immer'
import { useState } from "react";
import { nenaService, twitterService } from "./api";

/**
 * The number of texts that bundled together to be sent to 
 * the Nena service in one go. This limit is 5 after knowing the
 * limitations of the Nena API
 */
const COUNT_OF_TEXTS = 5

/**
 * 
 * @param apiKey API Key to access Nena service
 * @param texts The list of texts (up to `COUNT_OF_TEXTS`) for sending to the sentiment analysis
 */
export async function getNPNSentiment(apiKey: string, texts: { [id: number]: string }): Promise<{ [id: number]: SentimentOutput<NPNLabelType>}> {
    if (Object.values(texts).length > COUNT_OF_TEXTS) {
        throw new Error("Make sure there are ATMOST 5 items in the `texts` list object")
    }

    console.log(texts)

    try {
        const response = await nenaService({
            method: 'POST',
            url: '/api/tasks/sentiment/base',
            data: {
                apiKey,
                payload: {
                    texts: Object.values(texts)
                }
            }
        })
    
        const { info, metadata, results } = response.data.output
        const { labels } = info
        const { logits } = metadata


        const mainOutput: { [id: number]: SentimentOutput<NPNLabelType>} = {}
        Object.keys(texts).forEach((_ix, text_idx) => {
            const output: SentimentValues<NPNLabelType> = {} as SentimentValues<NPNLabelType>
    
            labels.forEach((label: NPNLabelType, ix: number) => {
                output[label] = logits[text_idx][ix]
            });
        
            mainOutput[_ix] = { chosen: labels[results[text_idx]], dist: output }
        })

        return mainOutput
    } catch (err) {
        if (err.response === undefined) {
            // Check the console for the error
            console.error(err.message)
            throw new Error("Unable to process the request. Check the console to know more.")
        }

        const { data } = err.response


        const { message, code } = data
        
        const msg = `NENA_ERROR [code: ${code.toUpperCase()}] - ${message}`
        throw new Error(msg)
    }
}

const DEFAULT_TWITTER_QUERY_OPTIONS = {
    place_country: "TZ"
}


/**
 * 
 * @param q query string to search for tweets through the twitter API
 * @param twitterQueryOptions query options that can be used to add infromatino about the 
 *  querying of tweets. if undefined (default), it will use the default stated results
 */
export async function getTweetByQueryItem(bearer_token: string, q: string, twitterQueryOptions: object = undefined): Promise<TwitterResponse>{
    try {
        const response = await twitterService.get('/search/tweets.json', {
            params: {
                q: `#${q}`,
                ...(twitterQueryOptions || DEFAULT_TWITTER_QUERY_OPTIONS)
            },
            headers: {
                Authorization: `Bearer ${bearer_token}`,
            }
        })

        const trData: TwitterResponse = response.data
        return trData

    } catch (err) {
        if (err.response === undefined) {
            // Check the console for the error
            console.error(err.message)
            throw new Error("Unable to process the request. Check the console to know more.")
        }

        const { data } = err.response
        const { errors } = data 

        for (let error of errors) {
            const { message, code } = error
            throw new Error(`TWIITER_SERVICE_ERROR [code: ${code}] - ${message}`)
        }
    }
}


// the text cap
const limit = COUNT_OF_TEXTS

async function * streamSentiments(apiKey: string, texts: { [id: number]: string }): AsyncGenerator<[SentimentData, number], any, any>{
    
    const keyMaps = Object.keys(texts)
    // split the data into batches that can be worked on
    let N = keyMaps.length

    if (N === 0) {
        let errMessage = ("Please make sure you have atleast on input in the string")
        // setErr(errMessage)

        throw new Error(errMessage)
    } else {
        let start_idx = 0
        let end_idx: number;

        let iter_count = 0
        while (start_idx < N) {
            // last index

            // console.log(N, "-", start_idx, " = ", (N - start_idx))
            end_idx = Math.min(limit, N - start_idx) + start_idx - 1

            // console.log(iter_count, ": ", start_idx, " | ", end_idx)

            // but the set of texts needed to make 
            //  the single request prediction
            const temp_texts = {}
            for (let ix = start_idx; ix <= end_idx ; ix++) {
                temp_texts[keyMaps[ix]] = texts[keyMaps[ix]]
            }

            // the `temp_texts` has stored the temporary texts
            //  for determining the sentiments in batches
            // try {
            //     // console.log("Check the contents: ", temp_texts)
                
            // } catch (err) {
            //     throw err
            // }
            const chunk = await getNPNSentiment(apiKey, temp_texts)
            const chunkSize = (end_idx - start_idx)

            yield [chunk, (chunkSize + 1) / N]

            // update the indices
            start_idx = end_idx + 1
            iter_count++
        }
    }
}

/**
 * Streaming the predictions for sentiment analysis
 * Since the tool only allows working with 5 texts / request.
 * This hook will process and update the worked sentiment 5 at a time 
 * for the given number of texts
 */
export function useSentiment(apiKey: string): [SentimentData, (texts: {[id: number]: string}) => Promise<void>, boolean, number, (string | null)] {
    const [loading, setLoadstate] = useState<boolean>(false)
    const [progress, setProgress] = useState<number>(0)
    const [err, setErr] = useState<string | null>(null)

    // The data to render the content

    const [data, set] = useState<SentimentData>({})  
    
    const setData = async (texts: {[id: number]: string}) => {
        // set data
        setErr(null)
        setLoadstate(true)
        setProgress(0)

        // reset data
        set({})

        try {
            for await (const chunkLoadState of streamSentiments(apiKey, texts)) {
                const [chunk, chunkProgToUpdate] = chunkLoadState

                // Chunk
                set(data => ({ ...data, ...chunk }))

                // Progress bar
                setProgress(prog => prog + chunkProgToUpdate)
            }
        } catch (err) {
            // setting err
            setErr(err.message)
        }

        // Done loading
        setLoadstate(false)
    }

    return [data, setData, loading, progress, err]
}
