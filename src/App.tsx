import React, { useCallback, useState } from 'react'
import { EmotionSentimentBars } from './components/EmotionSentimentBars'
import HelperErrorText from './components/HelperErrorText'
import ProtectedField from './components/ProtectedField'
import { getEmotionSentimentValues } from './utils'

function ErrorPopup ({ err }: { err: string | null }){
  if (err === null) {
    return (<></>)
  }

  return (
    <div className="absolute bottom-0">
      {err}
    </div>
  )
}

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

function BarSection({ className, chosen, dist, loading }: BarSectionProps) {
  const showChart = chosen || dist

  if (!showChart && !loading) {
    return (
      <div className="flex flex-row md:flex-col gap-4">
        <svg className="h-8 w-8 md:h-12 md:w-12 md:my-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
        <p className="text-gray-400 md:w-48">
          Click on the 'Peleka' button to process the sentiment
        </p>
      </div>
    )
  }

  

  return (
    <section className={className}>
      <div className="w-full space-y-4">
        {
          chosen !== undefined ? (
            <div className="w-60">
              <p>
                Maandishi yaonekana kuleta hisia ya: <label className="font-bold capitalize">{outputLabels[chosen]}</label>
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
      </div>
    </section>
  )
}

function SubmitButton({ children, loading }: any) {
  return (

    <button disabled={loading} className={`inline-flex flex-row px-4 py-2 my-2 w-full md:w-auto items-center justify-center ${loading ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed' : 'bg-green-800 hover:bg-green-900'} rounded-md transition duration-100 text-white`}>
      {/* Heroicon: small-check */}
      {
        Boolean(loading) ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="text-white w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      }
      <span className={loading ? `text-gray-800` : `text-white`}>
        {children}
      </span>
    </button>
  )
}

function App() {
  const [apiKey, setApiKey] = useState<string>("")
  const [value, setValue] = useState<string>("")

  // for the button
  const [hasSaved, setHasSaved] = useState<boolean>(false)
  const onSaveApiKey = () => {

  }


  const onChangeApiKeyInput = (e: any) => setApiKey(e.target.value)
  const onChangeTextInput = (e: any) => setValue(e.target.value)


  // true is the fetched value is loading
  const [loading, setLoading] = useState<boolean>(false)

  // The emotion value of shape: EmotionSentimentValues
  const [emotion, setEmotion] = useState<EmotionOutput | undefined>(undefined)

  // Error message for when there is a problem
  const [err, setErr] = useState<string | null>(null)


  const onSubmitForm = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    console.log('Submitting form')

    setLoading(true)
    setErr(null)

      getEmotionSentimentValues(apiKey, value)
          .then(output => {
            console.log(output)
            setEmotion(output)
          })
          .catch(err => {
            setErr(err.message)
          })
          .finally(() => setLoading(false))

    e.preventDefault()
  }, [apiKey, value])

  
  return (
    <div className="h-screen w-full flex flex-row items-center justify-center">
      <ErrorPopup err={err} />
      <div className="mx-auto container justify-center grid grid-rows-2 gap-6 md:grid-rows-none md:grid-cols-2 md:justify-start md:items-center px-12">
        {/* left | top entry section */}
        <section className="max-w-md flex flex-col items-start md:items-end">
          <div className='items-end justify-end flex flex-col'>
            <div className="w-64 text-left md:text-right">
              <h1 className="text-3xl font-bold">Hisia Maandishi</h1>
              <h4 className="text-sm font-medium text-gray-500">Emotional sentiment analysis service using Nena API</h4>
            </div>
            <div className="flex flex-row space-x-2 ">
              <ProtectedField 
                value={apiKey} 
                onChange={onChangeApiKeyInput} 
                placeholder="API_KEY" />
              <button 
                onChange={undefined}
                className="inline-flex flex-row p-2 w-full md:w-auto items-center justify-center space-x-2">
                {
                  !hasSaved ? (
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  )
                }
                <span className={!hasSaved ? 'text-gray-400' : 'text-green-400'}>{!hasSaved ? 'Save': 'Saved'}</span>
              </button>
            </div>
          </div>
          <form className="my-4 w-full text-left md:text-right" onSubmit={onSubmitForm}>
            <div>
              <textarea 
                value={value} 
                spellCheck={false}
                onChange={onChangeTextInput} 
                className="w-full h-24 resize-none border rounded-md px-3 py-3 focus:outline-none" placeholder="Andika chochote..."/>
              <div className="space-x-3 flex text-left">
                <HelperErrorText value="Please make sure you have entered something" />
                {/* right: message counter */}
                <span className="text-gray-500 text-sm whitespace-nowrap">40 / 1000</span>
              </div>
            </div>
            <SubmitButton loading={loading}>Peleka</SubmitButton>
          </form>
        </section>
        {/* right | bottom response section */}
        <BarSection 
          className="max-w-md"
          loading={loading}
          chosen={emotion?.chosen}
          dist={emotion?.dist} />
      </div>
    </div>
  );
}

export default App;
