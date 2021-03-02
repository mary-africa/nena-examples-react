import create, { State } from 'zustand'

interface AppState extends State {
    ready: boolean
}

/**
 * State for the entire application
 */
export const useAppStore = create<AppState>((set, get) => ({
    ready: true
}))
