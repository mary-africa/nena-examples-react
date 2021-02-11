import { Transition } from '@headlessui/react'
import React, { useCallback, useEffect, useState } from 'react'
import BarSection from './components/BarSection'
import HelperErrorText from './components/HelperErrorText'
import ProtectedField from './components/ProtectedField'
import { getEmotionSentimentValues } from './utils'

function ErrorPopup ({ err }: { err: string | null }) {
  const [showErr, setShowErr] = useState(err !== null)
  
  useEffect(() => {
    setShowErr(err !== null)
  }, [err])

  return (
    <Transition
      show={showErr}
      enter="transition transform duration-100 ease-in-out"
      enterFrom="scale-95 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="transition transform duration-150 ease-in-out"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-95 opacity-0"
      className="fixed top-0 inset-x-0 pt-2 sm:pt-5">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="p-2 rounded-lg bg-red-600 shadow-lg sm:p-3">
          <div className="flex items-center justify-between flex-wrap">
            <div className="w-0 flex-1 flex items-center">
              <p className="ml-3 font-medium text-white truncate">
                <span className="inline mb:block">
                  {err}
                </span>
              </p>
            </div>
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-2">
              <button
                onClick={() => setShowErr(false)}
                type="button" 
                className="-mr-1 flex p-2 rounded-md transition duration-100 ease-in hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-white">
                <span className="sr-only">Dismiss</span>
                {/* <!-- Heroicon name: outline/x --> */}
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}


function SubmitButton({ children, loading }: any) {
  return (
    <button disabled={loading} className={`inline-flex flex-row px-4 py-2 my-4 w-full md:w-auto items-center justify-center ${loading ? 'bg-gray-500 hover:bg-gray-600 cursor-not-allowed' : 'bg-green-800 hover:bg-green-900'} focus:outline-none rounded-md transition duration-100 text-white`}>
      {/* Heroicon: small-check */}
      {
        Boolean(loading) ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="w-5 h-5 -ml-1 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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

const TEXT_LIMIT = 160
function TextField({ value, onChange, className, showError, errorMessage }: any) {
  const [count, setCount] = useState(0)

  const updateCount = (length: number) => setCount(length)

  return (
    <div className="w-full">
      <textarea 
        maxLength={TEXT_LIMIT}
        value={value}
        spellCheck={false}
        onChange={(e) => {
          updateCount(e.target.value.length)
          onChange(e)
        }}
        className={className} placeholder="Andika chochote..."/>
      <div className="flex flex-row-reverse justify-between gap-2 text-left w-full">
        {/* right: message counter */}
        <span className="text-gray-500 text-sm whitespace-nowrap">{count} / {TEXT_LIMIT}</span>
        <HelperErrorText show={showError} value={errorMessage} />
      </div>
    </div>
  )
}

const STORAGE_KEY = 'API_KEY'

function App() {
  const apiKeyCache = localStorage.getItem(STORAGE_KEY)
  const isApiKeyCache = !(apiKeyCache === null)
  const [apiKey, setApiKey] = useState<string>(apiKeyCache === null ? "": apiKeyCache)

  // for the input text
  const [value, setValue] = useState<string>("")
  const [showInputErr, setShowInputErr] = useState<boolean>(false)

  // for the button
  const [hasSaved, setHasSaved] = useState<boolean>(isApiKeyCache)
  const onSaveApiKey = () => {
    localStorage.setItem(STORAGE_KEY, apiKey)    
    setHasSaved(true)
  }

  const onChangeApiKeyInput = (e: any) => {
    setHasSaved(false)
    setApiKey(e.target.value)
  }
  const onChangeTextInput = (e: any) => {
    setShowInputErr(false)
    setValue(e.target.value)
  }

  // true is the fetched value is loading
  const [loading, setLoading] = useState<boolean>(false)

  // The emotion value of shape: EmotionSentimentValues
  const [emotion, setEmotion] = useState<EmotionOutput | undefined>(undefined)

  // Error message for when there is a problem
  const [err, setErr] = useState<string | null>(null)


  const onSubmitForm = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    setErr(null)

    // check input
    if (value.length === 0) {
      setShowInputErr(true)
      setLoading(false)
    } else {
      getEmotionSentimentValues(apiKey, value)
        .then(output => {
          console.log(output)
          setEmotion(output)
        })
        .catch(err => {
          setErr(err.message)
        })
        .finally(() => setLoading(false))
  }


    e.preventDefault()
  }, [apiKey, value])

  
  return (
    <div className="h-screen w-full flex flex-row items-center justify-center">
      <ErrorPopup err={err} />
      <div className="mx-auto container justify-center grid grid-rows-2 gap-6 md:grid-rows-none md:grid-cols-2 md:justify-center md:items-center px-12">
        {/* left | top entry section */}
        <section className="w-full inline-flex flex-col items-center md:items-end">
          <div className='md:items-end md:justify-end flex flex-col space-y-4'>
            <div className="w-64 text-left md:text-right">
              <h1 className="text-3xl font-bold">Hisia Maandishi</h1>
              <h4 className="text-sm font-medium text-gray-500">Emotional sentiment analysis service using Nena API</h4>
            </div>
            <div className="flex flex-row space-x-2 h-12 w-full md:w-96">
              <ProtectedField 
                value={apiKey}
                onChange={onChangeApiKeyInput} 
                placeholder="API_KEY" />
              <button
                onClick={onSaveApiKey}
                className="inline-flex h-full mt-1 focus:outline-none flex-row px-2 w-auto items-center space-x-1 group">
                {
                  !hasSaved ? (
                    <svg className="h-5 w-5 text-green-400 group-hover:text-green-500 transition duration-100 ease-in-out" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
                <span className={`${!hasSaved ? 'text-green-400 group-hover:text-green-500' : 'text-gray-400'} transition duration-100 ease-in-out` }>{!hasSaved ? 'Save': 'Saved'}</span>
              </button>
            </div>
          </div>
          <form className="my-4 text-left md:text-right w-full md:w-96" onSubmit={onSubmitForm}>
            <div>
              <TextField 
                showError={showInputErr}
                errorMessage="Make sure you have typed something"
                className="w-full h-24 resize-none border rounded-md px-3 py-3 focus:outline-none" onChange={onChangeTextInput}/>
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
