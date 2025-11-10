import { useState, useCallback } from 'react'

type AsyncState = {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error: Error | null
}

type UseAsyncReturn = AsyncState & {
  runAsync: (promise: Promise<any>) => Promise<any>
  reset: () => void
}

export default function useAsync(): UseAsyncReturn {
  const [state, setState] = useState<AsyncState>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  })

  const runAsync = useCallback(async (promise: Promise<any>) => {
    setState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
    })

    try {
      const result = await promise
      setState({
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
      })
      return result
    } catch (error) {
      setState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: error as Error,
      })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
    })
  }, [])

  return {
    ...state,
    runAsync,
    reset,
  }
}
