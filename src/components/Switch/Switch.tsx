'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

type SwitchProps = {
  htmlFor: string
  shouldChecked?: boolean
  onChange?: (isChcked: boolean) => void
}

export const Switch = ({ htmlFor, shouldChecked, onChange }: SwitchProps) => {
  const [checked, setChecked] = useState(shouldChecked ? shouldChecked : false)

  return (
    <div>
      <label
        htmlFor={htmlFor}
        onClick={e => {
          e.preventDefault()
          setChecked(!checked)
          onChange && onChange(!checked)
        }}
        className='cursor-pointer'>
        <input type='checkbox' id={htmlFor} className='hidden' />

        <div className={cn('relative h-6 w-14 rounded-full', checked ? 'bg-[var(--color-secondary)]' : 'bg-slate-200')}>
          <div
            className='absolute top-1/2 left-0 h-7 w-7 bg-white rounded-[10px] box-content transition-all'
            style={{
              borderWidth: '2px 2px 4px',
              borderColor: checked ? 'var(--color-secondary)' : '#e2e8f0',
              transform: checked ? 'translate(25px, -50%)' : 'translate(-6px, -50%)'
            }}></div>
        </div>
      </label>
    </div>
  )
}
