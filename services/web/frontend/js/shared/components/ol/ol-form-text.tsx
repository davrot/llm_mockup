import React from 'react'

type OLFormTextProps = {
  type?: 'error' | 'info' | 'warning'
  children: React.ReactNode
}

export default function OLFormText({ type = 'info', children }: OLFormTextProps) {
  const className = type === 'error' ? 'text-danger' : 'text-muted'
  
  return (
    <small className={className}>
      {children}
    </small>
  )
}
