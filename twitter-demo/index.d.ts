type NPNLabelType = 'neutral' | 'positive' | 'negative'

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

