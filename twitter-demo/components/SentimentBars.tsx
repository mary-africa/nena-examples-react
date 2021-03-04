import React from 'react'

/**
 * The range of the values of the sentiment numbers ranges from
 * 0 to 1 inclusive -> [0, 1]
 */
type sentimentNumber = number

/**
 * Properties for the Making the emotional sentiment chart
 */
interface SentimentBarsProps<SentimentType extends string> {
    /**
     * The labels for the corresponding emotion sentiments
     */
    labels: { [type in SentimentType]: string }

    /**
     * The number sentiments for the emotion sentiments
     */
    sentiments?: SentimentOutput<SentimentType>['dist']

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

function SentimentBar({ label, value, className }: { label: string, value: sentimentNumber, className: any }) {
    return (
        <div className="grid grid-cols-4 gap-4 items-center w-full">
            <label className="block w-full text-right">{label}</label>
            <div className="col-span-3 h-3 w-full">
                {/* progress bar */}
                <span className={className} style={{ width: getPercentageString(value)}}></span>
            </div>
        </div>
    )
}

export default function NPNSentimentBars(props: SentimentBarsProps<NPNLabelType>) {
    if (props.sentiments === undefined) {
        return (
            <div>Nothing to show</div>
        )
    }
    return (
        <div className="grid grid-flow-row gap-2 max-w-xs px-4 py-2 transtion duration-75 ease-in border hover:border-blue-500 rounded-md">
            {/* Happy emotion */}
            <SentimentBar label={props.labels.positive} value={props.sentiments.positive} className="block bg-green-400 h-full transform duration-200 ease-out" />
            <SentimentBar label={props.labels.neutral} value={props.sentiments.neutral} className="block bg-indigo-400 h-full transform duration-200 ease-out" />
            <SentimentBar label={props.labels.negative} value={props.sentiments.negative} className="block bg-red-400 h-full transform duration-200 ease-out" />
        </div>
    )
}
