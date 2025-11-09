import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MaterialIcon from '@/shared/components/material-icon'
import { useLayoutContext } from '@/shared/context/layout-context'
import { useLLMChat } from '../hooks/use-llm-chat'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const LLMChatPane = React.memo(function LLMChatPane() {
  const { t } = useTranslation()
  const { llmChatIsOpen } = useLayoutContext()
  const { messages, isLoading, sendMessage, models, selectedModel, setSelectedModel } = useLLMChat()
  const [inputValue, setInputValue] = useState('')

  const [chatOpenedOnce, setChatOpenedOnce] = useState(llmChatIsOpen)
  useEffect(() => {
    if (llmChatIsOpen) {
      setChatOpenedOnce(true)
    }
  }, [llmChatIsOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue)
      setInputValue('')
    }
  }

  if (!chatOpenedOnce) {
    return null
  }

  const displayMessages = messages.filter(m => m.role !== 'system')
  const showModelSelector = models.length > 1

  return (
    <aside className="chat" aria-label={t('ai_assistant')}>
      <div className="llm-chat-container">
        {/* Model Selector Header - only shown if multiple models */}
        {showModelSelector && (
          <div className="llm-model-selector">
            <label htmlFor="model-select">Model:</label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={isLoading}
            >
              {models.map(model => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {displayMessages.length === 0 ? (
          <div className="llm-chat-welcome">
            <MaterialIcon type="smart_toy" className="llm-welcome-icon" />
            <h3>{t('latex_ai_assistant')}</h3>
            <p>{t('ai_assistant_description')}</p>
            <div className="llm-suggestions">
              <p className="llm-suggestions-title">{t('try_asking')}:</p>
              <ul>
                <li>"How do I create a table?"</li>
                <li>"Help me fix this equation"</li>
                <li>"How to add bibliography?"</li>
                <li>"Explain this LaTeX command"</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="llm-chat-messages">
            {displayMessages.map((msg, idx) => (
              <div key={idx} className={`llm-message llm-message-${msg.role}`}>
                <div className="message-container">
                  <div className="message-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="llm-message llm-message-assistant">
                <div className="message-container">
                  <div className="llm-message-loading">
                    <MaterialIcon type="smart_toy" className="loading-icon" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="llm-chat-input-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about LaTeX..."
            disabled={isLoading}
            className="llm-chat-input"
          />
          <button type="submit" disabled={isLoading || !inputValue.trim()}>
            <MaterialIcon type="send" />
          </button>
        </form>
      </div>
    </aside>
  )
})

export default LLMChatPane
