import React from 'react'

function HelperErrorText({ value }) {
  return (
    <span className="text-xs inline-flex flex-row space-x-2 text-red-600">
      <svg className="text-xs h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-xs">
        {value}
      </span>
    </span>
  )
}

function App() {
  return (
    <div className="h-screen w-full flex flex-row items-center justify-center">
      <div className="mx-auto container grid grid-rows-2 md:grid-rows-none md:grid-cols-2 items-center px-8">
        {/* left | top entry section */}
        <section className="max-w-xs">
          <div className='w-64'>
            <h1 className="text-3xl font-bold">Maandishi Hisia</h1>
            <h4 className="text-sm font-medium text-gray-500">Emotional sentiment analysis service using Nena API</h4>
          </div>
          <form className="my-4 w-full">
            <div>
              <textarea className="w-full h-24 resize-none border rounded-md px-3 py-3 text-sm focus:outline-none" placeholder="Andika chochote..."/>
              <div className="space-x-3 flex">
                <HelperErrorText value="Please make sure you have entered something" />
                {/* right: message counter */}
                <span className="text-gray-500 text-xs whitespace-nowrap">40 / 1000</span>
              </div>
            </div>
            <button className="inline-flex flex-row px-4 py-2 bg-green-800 rounded-md transition duration-75 text-white ">
              {/* Heroicon: small-check */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>
                Peleka
              </span>
            </button>
          </form>
        </section>
        {/* right | bottom response section */}
        <section className="max-w-sm space-y-4">
          <div className="w-60">
            Maandishi yaonekana kuleta hisia ya: <label className="font-bold">Furaha</label>
          </div>
          <div className="w-full">
            {/* Emotion tools */}
            <div className="grid grid-flow-row gap-2 w-full">
              {/* emotion item */}
              <div className="grid grid-cols-6 gap-4 items-center">
                <label className="text-right">Furaha</label>
                <div className="col-span-5 h-5 w-full">
                  {/* progress bar */}
                  <span className="block bg-green-400 h-full transform duration-200 ease-out" style={{ width: '55%'}}></span>
                </div>
              </div>
              {/* emotion item */}
              <div className="grid grid-cols-6 gap-4 items-center">
                <label className="text-right">Hofu</label>
                <div className="col-span-5 h-5 w-full">
                  {/* progress bar */}
                  <span className="block bg-blue-400 h-full" style={{ width: '15%'}}></span>
                </div>
              </div>
              {/* emotion item */}
              <div className="grid grid-cols-6 gap-4 items-center">
                <label className="text-right">Huzuni</label>
                <div className="col-span-5 h-5 w-full">
                  {/* progress bar */}
                  <span className="block bg-indigo-400 h-full" style={{ width: '25%'}}></span>
                </div>
              </div>
              {/* emotion item */}
              <div className="grid grid-cols-6 gap-4 items-center">
                <label className="text-right">Hasira</label>
                <div className="col-span-5 h-5 w-full">
                  {/* progress bar */}
                  <span className="block bg-red-400 h-full" style={{ width: '10%'}}></span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
