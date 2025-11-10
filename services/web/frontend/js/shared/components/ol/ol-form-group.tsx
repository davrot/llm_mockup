import React from 'react'

type OLFormGroupProps = {
  controlId?: string
  children: React.ReactNode
}

export default function OLFormGroup({ controlId, children }: OLFormGroupProps) {
  return (
    <div className="form-group" id={controlId}>
      {children}
    </div>
  )
}
