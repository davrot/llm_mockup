import classNames from 'classnames'
import { useState, useRef, MouseEventHandler, ElementType } from 'react'
import { useTranslation } from 'react-i18next'
import OLTooltip from '@/shared/components/ol/ol-tooltip'
import {
  ErrorLevel,
  SourceLocation,
  LogEntry as LogEntryData,
} from '@/features/pdf-preview/util/types'
import useResizeObserver from '@/features/preview/hooks/use-resize-observer'
import OLIconButton from '@/shared/components/ol/ol-icon-button'
import importOverleafModules from '../../../../../macros/import-overleaf-module.macro'
import MaterialIcon from '@/shared/components/material-icon'
import { useFileTreePathContext } from '@/features/file-tree/contexts/file-tree-path'
import { useFileTreeOpenContext } from '@/features/ide-react/context/file-tree-open-context'
import PdfLogEntryAskAIButton from '@/features/pdf-preview/components/pdf-log-entry-ask-ai-button' // ADD THIS LINE

const actionComponents = importOverleafModules(
  'pdfLogEntryHeaderActionComponents'
) as {
  import: { default: ElementType }
  path: string
}[]

function LogEntryHeader({
  sourceLocation,
  level,
  headerTitle,
  logType,
  showSourceLocationLink = true,
  onSourceLocationClick,
  collapsed,
  onToggleCollapsed,
  id,
  logEntry,
  actionButtonsOverride,
  openCollapseIconOverride,
}: {
  headerTitle: string | React.ReactNode
  level: ErrorLevel
  logType?: string
  sourceLocation?: SourceLocation
  showSourceLocationLink?: boolean
  onSourceLocationClick?: MouseEventHandler<HTMLButtonElement>
  collapsed: boolean
  onToggleCollapsed: () => void
  id?: string
  logEntry?: LogEntryData
  actionButtonsOverride?: React.ReactNode
  openCollapseIconOverride?: string
}) {
  const { t } = useTranslation()
  const logLocationSpanRef = useRef<HTMLSpanElement>(null)
  const [locationSpanOverflown, setLocationSpanOverflown] = useState(false)
  const { findEntityByPath } = useFileTreePathContext()
  const { openEntity } = useFileTreeOpenContext()

  useResizeObserver(
    logLocationSpanRef,
    locationSpanOverflown,
    checkLocationSpanOverflow
  )

  const file = sourceLocation ? sourceLocation.file : null
  const line = sourceLocation ? sourceLocation.line : null
  const logEntryHeaderTextClasses = classNames('log-entry-header-text', {
    'log-entry-header-text-error': level === 'error',
    'log-entry-header-text-warning': level === 'warning',
    'log-entry-header-text-info': level === 'info' || level === 'typesetting',
    'log-entry-header-text-success': level === 'success',
    'log-entry-header-text-raw': level === 'raw',
  })

  function checkLocationSpanOverflow(observedElement: ResizeObserverEntry) {
    const spanEl = observedElement.target
    const isOverflowing = spanEl.scrollWidth > spanEl.clientWidth
    setLocationSpanOverflown(isOverflowing)
  }

  const locationText =
    showSourceLocationLink && file ? `${file}${line ? `, ${line}` : ''}` : null

  const formattedLocationText = locationText ? (
    <span ref={logLocationSpanRef} className="log-entry-location">
      {`\u202A${locationText}\u202C`}
    </span>
  ) : null

  const headerTitleText = logType ? `${logType} ${headerTitle}` : headerTitle
  const fileData = file && findEntityByPath(file)
  const showGoToCodeButton =
    showSourceLocationLink &&
    !!fileData &&
    !(fileData.entity._id === openEntity?.entity._id && !line)

  console.log('[LogEntryHeader] Rendering:', {
    level,
    hasLogEntry: !!logEntry,
    logEntryLevel: logEntry?.level,
    file: sourceLocation?.file,
    line: sourceLocation?.line
  })

  return (
    <header className="log-entry-header-card">
      <button
        data-action="expand-collapse"
        data-collapsed={collapsed}
        className="log-entry-header-button"
        onClick={onToggleCollapsed}
        aria-label={collapsed ? t('expand') : t('collapse')}
      >
        <MaterialIcon
          type={
            openCollapseIconOverride ??
            (collapsed ? 'chevron_right' : 'expand_more')
          }
        />
        <div className="log-entry-header-content">
          <h3 className={logEntryHeaderTextClasses}>{headerTitleText}</h3>
          {locationSpanOverflown && formattedLocationText && locationText ? (
            <OLTooltip
              id={locationText}
              description={locationText}
              overlayProps={{ placement: 'right' }}
              tooltipProps={{ className: 'log-location-tooltip' }}
            >
              {formattedLocationText}
            </OLTooltip>
          ) : (
            formattedLocationText
          )}
        </div>
      </button>

      {actionButtonsOverride ?? (
        <div className="log-entry-header-actions">
          {showGoToCodeButton && (
            <OLTooltip
              id={`go-to-location-${locationText}`}
              description={t('go_to_code_location')}
              overlayProps={{ placement: 'bottom' }}
            >
              <OLIconButton
                onClick={onSourceLocationClick}
                variant="ghost"
                icon="my_location"
                accessibilityLabel={t('go_to_code_location')}
              />
            </OLTooltip>
          )}
          {/* ADD THE ASK AI BUTTON HERE */}
          {logEntry && <PdfLogEntryAskAIButton logEntry={logEntry} />}
          {/* END OF ADDITION */}
          {actionComponents.map(({ import: { default: Component }, path }) => (
            <Component key={path} logEntry={logEntry} id={id} />
          ))}
        </div>
      )}
    </header>
  )
}

export default LogEntryHeader

