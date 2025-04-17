import { ReactNode } from 'react'

export interface EditorProps {
  value: string
  onChange: (value: string) => void
  onSave?: (content: string) => Promise<void>
}

export interface CustomButtonProps {
  active?: boolean
  onClick: () => void
  disabled?: boolean
  children: ReactNode
  tooltip: string
}

export interface ImageAttributes {
  width?: string
  'data-width'?: string
  style?: string
  draggable?: boolean
  class?: string
  src?: string
  alt?: string
  title?: string
  float?: 'left' | 'center' | 'right' | null
  'data-float'?: string
}

export interface ImageToolbarProps {
  editor: any
  onChange: (html: string) => void
}

export interface MenuBarProps {
  editor: any
} 