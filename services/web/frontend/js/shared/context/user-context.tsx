import { createContext, useContext } from 'react'

type LLMSettings = {
  useOwnSettings: boolean
  modelName: string
  apiUrl: string
  hasApiKey: boolean
}

type SSHKeys = {
  Public: string
  Private: string
}

type UserContextValue = {
  id?: string
  email?: string
  first_name?: string
  last_name?: string
  sshkeys?: SSHKeys
  llmSettings?: LLMSettings
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function useUserContext() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}

export { UserContext }
export type { UserContextValue, LLMSettings, SSHKeys }
