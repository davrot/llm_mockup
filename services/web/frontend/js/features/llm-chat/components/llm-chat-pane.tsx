import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import MaterialIcon from '@/shared/components/material-icon'
import { useLayoutContext } from '@/shared/context/layout-context'

const LLMChatPane = React.memo(function LLMChatPane() {
  const { t } = useTranslation()
  const { llmChatIsOpen } = useLayoutContext()

  // Keep the LLM chat pane in the DOM to avoid re-rendering
  const [chatOpenedOnce, setChatOpenedOnce] = useState(llmChatIsOpen)
  useEffect(() => {
    if (llmChatIsOpen) {
      setChatOpenedOnce(true)
    }
  }, [llmChatIsOpen])

  if (!chatOpenedOnce) {
    return null
  }

  return (
    <aside className="chat" aria-label={t('ai_assistant')}>
      <div className="llm-chat-container">
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
          <div className="llm-status-badge">
            <MaterialIcon type="construction" />
            <span>{t('coming_soon')}</span>
          </div>
        </div>
      </div>
    </aside>
  )
})

export default LLMChatPane

