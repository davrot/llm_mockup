// Utility functions for making JSON API requests

type PostJSONOptions = {
  body?: any
  headers?: Record<string, string>
}

export async function postJSON(url: string, options: PostJSONOptions = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(options.body),
  })

  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`)
    try {
      const errorData = await response.json()
      Object.assign(error, errorData)
    } catch {
      // Could not parse error response
    }
    throw error
  }

  return await response.json()
}

export function getUserFacingMessage(error: any): string | null {
  if (!error) return null
  
  if (typeof error === 'string') return error
  
  if (error.message) return error.message
  
  if (error.error) return error.error
  
  if (error.details) return error.details
  
  return 'An error occurred'
}
