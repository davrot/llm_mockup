import React from 'react'

type OLFormLabelProps = {
  htmlFor?: string
  children: React.ReactNode
}

export default function OLFormLabel({ htmlFor, children }: OLFormLabelProps) {
  return (
    <label className="form-label" htmlFor={htmlFor}>
      {children}
    </label>
  )
}
