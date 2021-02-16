import { Transition } from "@headlessui/react"

export default function HelperErrorText({ value, show }: any) {
    return (
        <Transition
            show={show}
            enter="transition transform duration-75 ease-in-out"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition transform duration-75 ease-in-out"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
            className="inline-flex flex-row gap-2 items-center text-red-600">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">
                {value}
            </span>
        </Transition>
    )
}
