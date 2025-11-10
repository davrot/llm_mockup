import React from 'react'

type OLNotificationProps = {
  type: 'success' | 'error' | 'warning' | 'info'
  content: string
}

export default function OLNotification({ type, content }: OLNotificationProps) {
  const alertClass = {
    success: 'alert-success',
    error: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info',
  }[type]
  
  return (
    <div className={`alert ${alertClass}`} role="alert">
      {content}
    </div>
  )
}
