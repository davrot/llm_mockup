import React from 'react'

type OLButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  loadingLabel?: string
  form?: string
  children: React.ReactNode
  style?: React.CSSProperties
  'aria-labelledby'?: string
}

export default function OLButton({
  variant = 'primary',
  size = 'md',
  type = 'button',
  onClick,
  disabled = false,
  isLoading = false,
  loadingLabel,
  form,
  children,
  style,
  ...props
}: OLButtonProps) {
  const className = `btn btn-${variant} btn-${size}`
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
      form={form}
      style={style}
      {...props}
    >
      {isLoading ? loadingLabel || 'Loading...' : children}
    </button>
  )
}
