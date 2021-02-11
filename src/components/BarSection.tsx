import { Transition } from "@headlessui/react"
import { EmotionSentimentBars } from "./EmotionSentimentBars"


/**
 * Output labels corresponding to the sentiment
 */
const outputLabels: { [type in EmotionSentimentType]: string} = {
    'happy': "Furaha",
    'sad': "Huzuni",
    'anger': "Hasira",
    'fearful': "Hofu"
}

interface BarSectionProps {
    className: string
    chosen?: EmotionSentimentType,
    dist?: EmotionSentimentValues,
    loading: boolean
}
  
export default function BarSection({ className, chosen, dist, loading }: BarSectionProps) {
    const showChart = chosen || dist
    const blank = !showChart && !loading
  
    return (
      <section className={`relative ${className}`}>
        <Transition
          show={blank}
          enter="transition transform duration-75 ease-in-out"
          enterFrom="scale-95 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transition transform duration-100 ease-in-out"
          leaveFrom="scale-100 opacity-100"
          leaveTo="scale-95 opacity-0"
          className="flex flex-row md:flex-col gap-4">
            <svg className="h-8 w-8 md:h-12 md:w-12 md:my-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <p className="text-gray-400 md:w-48">
              Click on the 'Peleka' button to process the sentiment
            </p>
        </Transition>
        <Transition
          show={!blank}
          enter="transition transform duration-75 ease-in-out"
          enterFrom="-translate-y-full opacity-0"
          enterTo="translate-y-0 opacity-100"
          leave="transition transform duration-75 ease-in-out"
          leaveFrom="translate-y-0 opacity-100"
          leaveTo="-translate-y-full opacity-0"
          className="w-full space-y-4 relative">
          {
            chosen !== undefined ? (
              <div className="w-60">
                <p>
                  Hisia iliyo ya juu ni ya: <label className="font-bold capitalize">{outputLabels[chosen]}</label>
                </p>
              </div>
            ) : null
          }
          {
            dist !== undefined ? (
              <div className="w-full">
                <EmotionSentimentBars 
                  loading={loading} 
                  labels={outputLabels}
                  emotions={dist}/>
              </div>
            ) : null
          }
        </Transition>
          <Transition
            show={loading}
            enter="transition transform duration-75 ease-in-out"
            enterFrom="-translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition transform duration-75 ease-in-out"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="-translate-y-full opacity-0"
            className="w-full absolute inline-flex flex-row space-x-4 my-3 items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span>
            <span className="text-gray-400">
              Loading
            </span>
          </Transition>
      </section>
    )
}
