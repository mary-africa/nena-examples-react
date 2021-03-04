import { useState } from 'react'
import HelperErrorText from './HelperErrorText'

export default function ProtectedField({ value, errShow, ...inputProps }: any) {
    const [visible, setVisible] = useState<boolean>(false)
    
    return (
      <div className="w-full">
        <div className={`mb-1 relative rounded-md shadow-sm w-full flex flex-row border ${errShow ? 'border-red-500' : 'border-gray-300'}  transition duration-100 ease-linear`}>
          <div className={`absolute inset-y-0 left-0 pl-2 pr-2 rounded-l-sm flex items-center pointer-events-none ${errShow ? 'bg-red-500' : 'bg-gray-200'}  transition duration-100 ease-linear`}>
            {/* Heroicon name: solid/key */}
            <svg className={`h-5 w-5 ${errShow ? 'text-white':'text-gray-600'} transition duration-100 ease-linear`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <input {...inputProps} type={visible ? 'text': 'password'} value={value} className={`focus:outline-none block w-full py-2 pl-12 sm:text-sm rounded-l-md ${errShow ? 'text-red-600': 'text-black'}`} />
          <button onClick={() => setVisible(!visible)} className="px-3 z-10 flex items-center focus:outline-none group">
            {
              visible ? (
                <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-700 transition duration-100 ease-in-out" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-700 transition duration-100 ease-in-out" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>            
              )
            }
          </button>
        </div>
        <div className="mt-2">
          <HelperErrorText show={Boolean(errShow)} value="Missing API_KEY" />
        </div>
      </div>
    )
}
