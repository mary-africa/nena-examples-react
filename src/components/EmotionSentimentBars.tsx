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
    happyLabel?: string
    sadLabel?: string
    angerLabel?: string
    fearfulLabel?: string

    /**
     * The number sentiments for the emotion sentiments
     */
    happy: sentimentNumber
    sad: sentimentNumber,
    anger: sentimentNumber,
    fearful: sentimentNumber,
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
  return (
    <div className="grid grid-flow-row gap-2 w-full">
        {/* Happy emotion */}
        <EmotionSentimentBar label={props.happyLabel || "Furaha" } value={props.happy} className="block bg-green-400 h-full transform duration-200 ease-out" />
        <EmotionSentimentBar label={props.fearfulLabel || "Hofu" } value={props.fearful} className="block bg-blue-400 h-full transform duration-200 ease-out" />
        <EmotionSentimentBar label={props.sadLabel || "Huzuni" } value={props.sad} className="block bg-indigo-400 h-full transform duration-200 ease-out" />
        <EmotionSentimentBar label={props.angerLabel || "Furaha" } value={props.anger} className="block bg-red-400 h-full transform duration-200 ease-out" />
    </div>
  )
}
