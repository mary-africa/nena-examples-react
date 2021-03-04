import axios from 'axios'
import cors from 'cors'
import { NextApiRequest, NextApiResponse } from 'next'
import { initMiddleware } from '../../utils/api'


// Initialize the cors middleware
const corsMiddleware = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  const response = await axios({
    url: '/search/tweets.json',
    baseURL: 'https://api.twitter.com/1.1/',
    headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        "X-Requested-With": "XMLHttpRequest"
    }
  })

  return response.data
}