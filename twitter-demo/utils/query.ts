/**
 * Utility functions used accros the app
 */

import { nenaService, twitterService } from "./api";

/**
 * The number of texts that bundled together to be sent to 
 * the Nena service in one go. This limit is 5 after knowing the
 * limitations of the Nena API
 */
const COUNT_OF_TEXTS = 5

type SentimentValues<LabelType extends string> = {
    [type in LabelType]: number
}

interface SentimentOutput<LabelType extends string> {
    chosen: LabelType,
    dist: SentimentValues<LabelType>
}

/**
 * 
 * @param apiKey API Key to access Nena service
 * @param texts The list of texts (up to `COUNT_OF_TEXTS`) for sending to the sentiment analysis
 */
export async function getNPNSentiment(apiKey: string, texts: Array<string>): Promise<Array<SentimentOutput<NPNLabelType>>> {
    if (texts.length > COUNT_OF_TEXTS) {
        throw new Error("Make sure there are ATMOST 5 items in the `texts` list object")
    }

    try {
        const response = await nenaService({
            method: 'POST',
            url: '/api/tasks/sentiment/base',
            data: {
                apiKey,
                payload: {
                    texts
                }
            }
        })
    
        const { info, metadata, results } = response.data.output
        const { labels } = info
        const { logits } = metadata

        return texts.map((_, text_idx) => {
            const output: SentimentValues<NPNLabelType> = {} as SentimentValues<NPNLabelType>
    
            labels.forEach((label: NPNLabelType, ix: number) => {
                output[label] = logits[text_idx][ix]
            });
        
            return { chosen: labels[results[text_idx]], dist: output }
        })

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


interface TwitterResponse {
    statuses: Array<TwitterStatus>
    search_metadata: TwitterSearchMetadata
}

interface TwitterStatus {
    created_at: string
    id: number
    id_str: number
    text: string
    truncated: boolean
    entities: {
        hashtags: string[]
        symbols: string[]
        user_mentions: Array<{
            screen_name: string
            name: string
            id: number
            id_str: string
            indices: number[]
        }>
        urls: unknown[]
    },
    user: {
        id: number
        id_str: number
        name: string
        screen_name: string
        location: string
        description: string
        url: null | string
        entities: {
            description: {
                urls: unknown[]
            }
        }
    }
}

interface TwitterSearchMetadata {
    completed_in: number // [0, 1] (elements of R)
    max_id: number
    max_id_str: string

    /**
     * query string to get the information of the next results
     */
    next_results: string

    /**
     * query string used in obtain the results
     */
    query: string

    refresh_url: string

    /**
     * number of items searched for in the current query
     */
    count: number

    since_id: number
    since_id_str: string
}

const DEFAULT_TWITTER_QUERY_OPTIONS = {
    result_type: 'popular',
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
                q,
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
