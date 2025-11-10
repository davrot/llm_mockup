import { useState, useCallback, useEffect, useRef } from 'react'
import getMeta from '@/utils/meta'

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface LLMModel {
  id: string
  name: string
  isDefault: boolean
}

interface LLMResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

const SYSTEM_PROMPT = `You are an expert LaTeX debugging assistant and compiler error specialist.

**Your Primary Role - Error Debugging:**
- Analyze LaTeX compilation errors and warnings
- Identify syntax mistakes, missing packages, and structural issues
- Explain errors in beginner-friendly language
- Provide working fixes with clear explanations

**When a user sends a compilation error:**

1. **Quick Summary** (1-2 sentences)
   - What's wrong in plain English
   
2. **The Problem**
   - Explain the error clearly
   - Point to the exact issue in their code
   
3. **The Fix**
   - Show corrected code in \`\`\`latex blocks
   - Highlight what changed
   
4. **Why This Happened**
   - Brief explanation of the root cause
   - How to prevent it in future

**Error Analysis Guidelines:**
- The line marked with → is where the error occurred
- Look at surrounding context for clues
- Common issues: typos in commands, missing packages, unmatched braces
- Check for: \\begin without \\end, missing $, wrong package names

**Also Helpful With:**
- General LaTeX syntax and commands
- Document structure and formatting
- Mathematical typesetting
- Bibliography and citations

**Response Style:**
- Be concise and practical
- Use code blocks for all LaTeX examples
- Assume the user is learning LaTeX
- Focus on solving the immediate problem first

Remember: The user is likely frustrated. Be encouraging and clear!`

export const useLLMChat = () => {
  const projectId = getMeta('ol-project_id')
  
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: SYSTEM_PROMPT
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [models, setModels] = useState<LLMModel[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [lastUserMessage, setLastUserMessage] = useState<string>('')

  // AbortController for cancelling requests
  const abortControllerRef = useRef<AbortController | null>(null)

  const messagesRef = useRef(messages)
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(`/project/${projectId}/llm/models`)
        const data = await response.json()
        setModels(data.models)
        const defaultModel = data.models.find((m: LLMModel) => m.isDefault) || data.models[0]
        setSelectedModel(defaultModel?.id || '')
        console.log('[LLMChat] Available models:', data.models)
      } catch (err) {
        console.error('[LLMChat] Failed to fetch models:', err)
      }
    }
    fetchModels()
  }, [projectId])

  const sendMessage = useCallback(async (userMessage: string) => {
    console.log('[LLMChat] ===== Starting LLM Chat Request =====')
    console.log('[LLMChat] User message:', userMessage)
    console.log('[LLMChat] Project ID:', projectId)
    console.log('[LLMChat] Selected model:', selectedModel)
    
    const newMessages: Message[] = [
      ...messagesRef.current,
      { role: 'user', content: userMessage }
    ]
    
    setMessages(newMessages)
    setIsLoading(true)
    setError(null)
    setLastUserMessage(userMessage)

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController()

    try {
      const url = `/project/${projectId}/llm/chat`
      console.log('[LLMChat] Request URL:', url)
      
      // Get CSRF token from meta tag
      const csrfToken = getMeta('ol-csrfToken')
      
      // Use fetch directly with AbortController signal
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel
        }),
        signal: abortControllerRef.current.signal,
        credentials: 'same-origin'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: LLMResponse = await response.json()
      console.log('[LLMChat] Response received successfully')

      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid response format from LLM API')
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      }

      console.log('[LLMChat] Assistant response received')
      setMessages([...newMessages, assistantMessage])
      console.log('[LLMChat] ===== Request Completed Successfully =====')
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('[LLMChat] Request aborted by user')
        const abortMsg: Message = {
          role: 'assistant',
          content: '⚠️ Request stopped by user.'
        }
        setMessages([...newMessages, abortMsg])
      } else {
        console.error('[LLMChat] ===== ERROR OCCURRED =====')
        console.error('[LLMChat] Error:', err)
        
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        
        const errorMsg: Message = {
          role: 'assistant',
          content: `❌ Error: ${errorMessage}\n\nPlease check the console for details.`
        }
        setMessages([...newMessages, errorMsg])
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }, [projectId, selectedModel])

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('[LLMChat] Aborting current request')
      abortControllerRef.current.abort()
    }
  }, [])

  const rerunLastMessage = useCallback(() => {
    if (lastUserMessage) {
      console.log('[LLMChat] Rerunning last message:', lastUserMessage)
      // Remove the last assistant response if it exists
      const lastMsg = messagesRef.current[messagesRef.current.length - 1]
      if (lastMsg?.role === 'assistant') {
        setMessages(messagesRef.current.slice(0, -2)) // Remove last user + assistant messages
      }
      // Resend the message
      setTimeout(() => sendMessage(lastUserMessage), 100)
    }
  }, [lastUserMessage, sendMessage])

  const clearMessages = useCallback(() => {
    console.log('[LLMChat] Clearing messages')
    setMessages([{
      role: 'system',
      content: SYSTEM_PROMPT
    }])
    setError(null)
    setLastUserMessage('')
  }, [])

  useEffect(() => {
    const handleSendMessage = (event: CustomEvent<{ message: string }>) => {
      console.log('[LLMChat] Received message from error logs')
      sendMessage(event.detail.message)
    }

    window.addEventListener('llm-chat-send-message', handleSendMessage as EventListener)
    
    return () => {
      window.removeEventListener('llm-chat-send-message', handleSendMessage as EventListener)
    }
  }, [sendMessage])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    rerunLastMessage,
    clearMessages,
    models,
    selectedModel,
    setSelectedModel,
    canRerun: !!lastUserMessage,
  }
}
