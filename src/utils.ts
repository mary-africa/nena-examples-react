import axios from 'axios'

const nenaService = axios.create({
    baseURL: 'https://api.nena.mary.africa/',
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "X-Requested-With": "XMLHttpRequest"
    }
});

nenaService.defaults.headers.post['Content-Type'] = 'application/json';

export async function getEmotionSentimentValues(apiKey: string, text: string): Promise<EmotionOutput> {
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
        const { data } = err.response

        if (data === undefined) {
            // Check the console for the error
            console.error(err.message)
            throw new Error("Unable to process the request. Check the console to know more.")
        }

        const { message, code } = data
        
        const msg = `NENA_ERROR [code: ${code.toUpperCase()}] - ${message}`
        throw new Error(msg)
    }
}
