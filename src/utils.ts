import axios from 'axios'
import { useEffect, useState } from 'react';

const nenaService = axios.create({
    baseURL: 'https://api.nena.mary.africa/',
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "X-Requested-With": "XMLHttpRequest"
    }
});

nenaService.defaults.headers.post['Content-Type'] = 'application/json';

type EmotionSentimentType  = 'happy' | 'anger' | 'fearful' | 'sad'
type EmotionSentimentValues = {
    [type in EmotionSentimentType]: number
}

interface EmotionOutput {
    chosen: EmotionSentimentType,
    dist: EmotionSentimentValues
}

async function getEmotionSentimentValues(apiKey: string, text: string): Promise<EmotionOutput> {
    try {
        const response = await nenaService({
            method: 'POST',
            url: '/api/tasks/sentiment/emotion',
            data: {
                apiKey,
                payload: {
                    texts: [text]
                }
            }
        })
    
        const { info, metadata, results } = response.data.output
        const { labels } = info
        const { logits } = metadata

        const output: any = {}
        labels.forEach((label: EmotionSentimentType, ix: number) => {
            output[label] = logits[0][ix]
        });
    
        return { chosen: labels[results[0]], dist: output }

    } catch (err) {
        console.error(err)
        throw new Error("Something went wrong, Unable to make request. Check the console.log to know more about the error")
    }
}


export function useEmotionSentiment(apiKey: string, text: string): [EmotionOutput | undefined, boolean, string | null] {
    // true is the fetched value is loading
    const [loading, setLoading] = useState<boolean>(true)

    // The emotion value of shape: EmotionSentimentValues
    const [emotion, setEmotion] = useState<EmotionOutput | undefined>(undefined)

    // Error message for when there is a problem
    const [err, setErr] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        setErr(null)
        
        getEmotionSentimentValues(apiKey, text)
            .then(output => setEmotion(output))
            .catch(err => setErr(err))
            .finally(() => setLoading(false))
    }, [apiKey, text])

    return [emotion, loading, err]
}
