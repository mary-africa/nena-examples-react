
type EmotionSentimentType  = 'happy' | 'anger' | 'fearful' | 'sad'
type EmotionSentimentValues = {
    [type in EmotionSentimentType]: number
}

interface EmotionOutput {
    chosen: EmotionSentimentType,
    dist: EmotionSentimentValues
}
