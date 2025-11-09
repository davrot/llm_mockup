import { useLayoutContext } from '@/shared/context/layout-context'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'

export const useChatPane = () => {
  const { chatIsOpen: isOpen, setChatIsOpen: setIsOpen } = useLayoutContext()
  const [resizing, setResizing] = useState(false)
  const panelRef = useRef<ImperativePanelHandle>(null)

  // Manually control panel expansion/collapse based on state
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    console.log('[useChatPane] State changed to:', isOpen)
    
    if (isOpen) {
      panel.expand()
    } else {
      panel.collapse()
    }
  }, [isOpen])

  const togglePane = useCallback(() => {
    console.log('[useChatPane] Toggling regular chat from', isOpen, 'to', !isOpen)
    setIsOpen(value => !value)
  }, [setIsOpen, isOpen])

  const handlePaneExpand = useCallback(() => {
    console.log('[useChatPane] Regular chat expand callback called')
    if (!isOpen) {
      setIsOpen(true)
    }
  }, [isOpen, setIsOpen])

  const handlePaneCollapse = useCallback(() => {
    console.log('[useChatPane] Regular chat collapse callback called')
    if (isOpen) {
      setIsOpen(false)
    }
  }, [isOpen, setIsOpen])

  return {
    isOpen,
    panelRef,
    resizing,
    setResizing,
    togglePane,
    handlePaneExpand,
    handlePaneCollapse,
  }
}
