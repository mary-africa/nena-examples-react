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

function App() {
  const [apiKey, setApiKey] = useState<string>("")
  const [value, setValue] = useState<string>("")

  const onChangeApiKeyInput = (e: any) => setApiKey(e.target.value)
  const onChangeTextInput = (e: any) => setValue(e.target.value)


  // true is the fetched value is loading
  const [loading, setLoading] = useState<boolean>(true)

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
          <div className='w-64 text-left md:text-right'>
            <h1 className="text-3xl font-bold">Maandishi Hisia</h1>
            <h4 className="text-sm font-medium text-gray-500">Emotional sentiment analysis service using Nena API</h4>
            <ProtectedField value={apiKey} onChange={onChangeApiKeyInput} placeholder="API_KEY" />
          </div>
          <form className="my-4 w-full text-left md:text-right" onSubmit={onSubmitForm}>
            <div>
              <textarea value={value} onChange={onChangeTextInput} className="w-full h-24 resize-none border rounded-md px-3 py-3 focus:outline-none" placeholder="Andika chochote..."/>
              <div className="space-x-3 flex text-left">
                <HelperErrorText value="Please make sure you have entered something" />
                {/* right: message counter */}
                <span className="text-gray-500 text-sm whitespace-nowrap">40 / 1000</span>
              </div>
            </div>
            <button className="inline-flex flex-row px-4 py-2 my-2 w-full md:w-auto items-center justify-center bg-green-800 rounded-md transition duration-75 text-white ">
              {/* Heroicon: small-check */}
              <svg className="text-white w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>
                Peleka
              </span>
            </button>
          </form>
        </section>
        {/* right | bottom response section */}
        <section className="max-w-md space-y-4">
          <div className="w-60">
            <p>
              Maandishi yaonekana kuleta hisia ya: <label className="font-bold">Furaha</label>
            </p>
          </div>
          <div className="w-full">
            <EmotionSentimentBars loading={loading} emotions={emotion !== undefined ? emotion.dist : undefined}/>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
