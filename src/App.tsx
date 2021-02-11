import React, { useCallback, useState } from 'react'
import { EmotionSentimentBars } from './components/EmotionSentimentBars'


function HelperErrorText({ value }: any) {
  return (
    <span className="text-xs inline-flex flex-row space-x-2 text-red-600">
      <svg className="text-xs h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-sm">
        {value}
      </span>
    </span>
  )
}

function ProtectedField({ value, ...inputProps }: any) {
  const [visible, setVisible] = useState(false)


  return (
    <div className="w-full my-2">
      <div className="mb-1 relative rounded-md shadow-sm w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* Heroicon name: solid/key */}
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <input {...inputProps} type={visible ? 'text': 'password'} value={value} className="focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 pl-10 sm:text-sm border-gray-300 rounded-md" />
        <button onClick={() => setVisible(!visible)} className="absolute inset-y-0 -right-11 px-3 z-10 flex items-center">
          {/* <!-- Heroicon name: solid/question-mark-circle --> */}
            {
              visible ? (
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>            
              )
            }
        </button>
      </div>
    </div>
  )
}


function App() {
  const [apiKey, setApiKey] = useState("")
  const onChangeApiKeyInput = (e: any) => setApiKey(e.target.value)
  
  return (
    <div className="h-screen w-full flex flex-row items-center justify-center">
      <div className="mx-auto container justify-center grid grid-rows-2 gap-6 md:grid-rows-none md:grid-cols-2 md:justify-start md:items-center px-12">
        {/* left | top entry section */}
        <section className="max-w-md flex flex-col items-start md:items-end">
          <div className='w-64 text-left md:text-right'>
            <h1 className="text-3xl font-bold">Maandishi Hisia</h1>
            <h4 className="text-sm font-medium text-gray-500">Emotional sentiment analysis service using Nena API</h4>
            <ProtectedField value={apiKey} onChange={onChangeApiKeyInput} placeholder="API_KEY" />
          </div>
          <form className="my-4 w-full text-left md:text-right">
            <div>
              <textarea className="w-full h-24 resize-none border rounded-md px-3 py-3 focus:outline-none" placeholder="Andika chochote..."/>
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
            <EmotionSentimentBars
              happy={0.45}
              sad={0.25}
              fearful={0.15}
              anger={0.1} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
