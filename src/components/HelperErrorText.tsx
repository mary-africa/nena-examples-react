export default function HelperErrorText({ value }: any) {
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
