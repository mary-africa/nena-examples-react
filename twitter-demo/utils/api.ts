import axios from "axios";
import e from "cors";

/**
 * Axios instance for the twitter API serivice
 */
console.log(process.env.APP_URL)

export const twitterService = axios.create({
    baseURL: 'https://api.twitter.com/1.1/',
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "X-Requested-With": "XMLHttpRequest"
    }
});



/**
 * Axios instance for the nena API serivice
 */
export const nenaService = axios.create({
    baseURL: 'https://api.nena.mary.africa/',
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "X-Requested-With": "XMLHttpRequest"
    }
});

nenaService.defaults.headers.post['Content-Type'] = 'application/json';

export function initMiddleware(middleWare: any) {
    return (req, res) => {
        new Promise((resolve, reject) => {
            middleWare(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result)
                }
                return resolve(result)
            })
        })
    }
}