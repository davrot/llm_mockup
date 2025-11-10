import React from 'react'

type OLFormControlProps = {
  type: string
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onInvalid?: (event: React.InvalidEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  readOnly?: boolean
  maxLength?: number
  'data-ol-dirty'?: boolean
}

export default function OLFormControl({
  type,
  value,
  onChange,
  onInvalid,
  placeholder,
  required = false,
  readOnly = false,
  maxLength,
  ...props
}: OLFormControlProps) {
  return (
    <input
      className="form-control"
      type={type}
      value={value}
      onChange={onChange}
      onInvalid={onInvalid}
      placeholder={placeholder}
      required={required}
      readOnly={readOnly}
      maxLength={maxLength}
      {...props}
    />
  )
}
