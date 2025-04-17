import React from 'react'
import { Tooltip } from '@medusajs/ui'
import { CustomButtonProps } from '../types'

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ active, onClick, disabled, children, tooltip }, ref) => (
    <Tooltip content={tooltip}>
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded hover:bg-gray-500 ${
          active ? 'bg-gray-500' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {children}
      </button>
    </Tooltip>
  )
)

CustomButton.displayName = 'CustomButton'

export default CustomButton