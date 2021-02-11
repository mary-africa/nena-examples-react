import React from 'react'

/**
 * The range of the values of the sentiment numbers ranges from
 * 0 to 1 inclusive -> [0, 1]
 */
type sentimentNumber = number

/**
 * Properties for the Making the emotional sentiment chart
 */
interface EmotionSentimentBarsProps {
    /**
     * The labels for the corresponding emotion sentiments
     */
    labels: { [type in EmotionSentimentType]: string }

    /**
     * The number sentiments for the emotion sentiments
     */
    emotions?: EmotionOutput['dist']

    /**
     * state for whether the values are ready to be loaded
     */
    loading: boolean
}

/**
 * Computes the values of sentiment in percentage
 * 
 * NOTE: `value` will be forced to be within range if its not in the range 
 * @param value sentiment value at [0, 1] range
 * @returns the percentage of the sentiment as a string
 */
function getPercentageString(value: sentimentNumber) {
    return `${(Math.min(Math.max(0, value), value) * 100).toFixed(2)}%`
}

function EmotionSentimentBar({ label, value, className }: { label: string, value: sentimentNumber, className: any }) {
    return (
        <div className="grid grid-cols-6 gap-4 items-center">
            <label className="text-right">{label}</label>
            <div className="col-span-5 h-5 w-full">
                {/* progress bar */}
                <span className={className} style={{ width: getPercentageString(value)}}></span>
            </div>
        </div>
    )
}

export function EmotionSentimentBars(props: EmotionSentimentBarsProps) {
    if (props.emotions === undefined) {
        return (
            <div>Nothing to show</div>
        )
    }
    return (
        <div className="grid grid-flow-row gap-2 w-full">
            {/* Happy emotion */}
            <EmotionSentimentBar label={props.labels.happy} value={props.emotions.happy} className="block bg-green-400 h-full transform duration-200 ease-out" />
            <EmotionSentimentBar label={props.labels.fearful } value={props.emotions.fearful} className="block bg-blue-400 h-full transform duration-200 ease-out" />
            <EmotionSentimentBar label={props.labels.sad } value={props.emotions.sad} className="block bg-indigo-400 h-full transform duration-200 ease-out" />
            <EmotionSentimentBar label={props.labels.anger } value={props.emotions.anger} className="block bg-red-400 h-full transform duration-200 ease-out" />
        </div>
    )
}
