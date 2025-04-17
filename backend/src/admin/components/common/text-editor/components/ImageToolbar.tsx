import { useState, useEffect, useCallback, useRef } from 'react'
import { Button, Tooltip, Input, Select } from '@medusajs/ui'
import { isNodeSelection, Editor } from '@tiptap/react'
import { AlignLeft, AlignCenter, AlignRight, ExternalLink } from 'lucide-react'
import { ImageToolbarProps } from '../types'
import CustomButton from './CustomButton'

interface ImageAttributes {
  alt: string
  link: string
  size: string
  float: 'left' | 'center' | 'right'
}

type SetImageAttributes = React.Dispatch<React.SetStateAction<ImageAttributes>>

const useImageSelection = (editor: Editor | null) => {
  const [isImageSelected, setIsImageSelected] = useState(false)
  const [imageAttributes, setImageAttributes] = useState<ImageAttributes>({
    alt: '',
    link: '',
    size: '25',
    float: 'center'
  })
  const userInteractedRef = useRef(false)

  useEffect(() => {
    if (!editor) {
      setIsImageSelected(false)
      setImageAttributes({ alt: '', link: '', size: '25', float: 'center' })
      userInteractedRef.current = false
      return
    }

    const handleSelectionUpdate = () => {
      if (!editor.state) {
        setIsImageSelected(false)
        return
      }

      const { selection } = editor.state
      const isImageNode = isNodeSelection(selection) && selection.node.type.name === 'image'

      if (isImageNode && selection.node.attrs) {
        const attrs = selection.node.attrs        
        let float: 'left' | 'center' | 'right' = 'center'

        if (attrs['data-float']) {
          float = attrs['data-float'] as 'left' | 'center' | 'right'
        }

        // Get width from the width attribute or style
        let width = '25'
        if (attrs.width) {
          width = attrs.width.replace(/%/g, '')
        } else if (attrs.style) {
          const widthMatch = attrs.style.match(/width:\s*(\d+)%/)
          if (widthMatch) {
            width = widthMatch[1]
          }
        }

        setImageAttributes({
          alt: attrs.alt || '',
          link: attrs['data-link'] || '',
          size: width,
          float
        })
        setIsImageSelected(true)
      } else {
        if (!isImageNode) {
          setIsImageSelected(false)
        }
      }
    }

    const handleUserInteraction = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const isImageClick = target.closest('.editor-image') !== null || target.closest('.image-container') !== null
      
      if (isImageClick) {
        userInteractedRef.current = true
        handleSelectionUpdate()
      }
    }

    editor.view.dom.addEventListener('mousedown', handleUserInteraction)
    handleSelectionUpdate()
    editor.on('selectionUpdate', handleSelectionUpdate)

    return () => {
      editor.off('selectionUpdate', handleSelectionUpdate)
      editor.view.dom.removeEventListener('mousedown', handleUserInteraction)
    }
  }, [editor])

  return { isImageSelected, imageAttributes, setImageAttributes }
}

const useImageUpdates = (
  editor: Editor | null,
  onChange: (html: string) => void,
  imageAttributes: ImageAttributes,
  setImageAttributes: SetImageAttributes
) => {
  const updateImageSize = useCallback((newSize: string) => {
    if (!editor?.state || !isNodeSelection(editor.state.selection)) return

    const { selection } = editor.state
    if (selection.node.type.name !== 'image') return

    const float = selection.node.attrs['data-float'] || 'center'
    let style = ''

    switch (float) {
      case 'left':
        style = `float: left !important; margin: 0.5em 1em 0.5em 0 !important; width: ${newSize}% !important;`
        break
      case 'right':
        style = `float: right !important; margin: 0.5em 0 0.5em 1em !important; width: ${newSize}% !important;`
        break
      case 'center':
      default:
        style = `display: block !important; float: none !important; margin: 0.5em auto !important; width: ${newSize}% !important;`
    }

    const transaction = editor.state.tr.setNodeMarkup(selection.from, undefined, {
      ...selection.node.attrs,
      width: `${newSize}%`,
      'data-width': newSize,
      style,
    })

    editor.view.dispatch(transaction)
    editor.commands.focus()
    const html = editor.getHTML()
    onChange(html)
    setImageAttributes(prev => ({ ...prev, size: newSize }))
  }, [editor, onChange])

  const updateImageFloat = useCallback((float: 'left' | 'center' | 'right') => {
    if (!editor?.state || !isNodeSelection(editor.state.selection)) return
    
    const { selection } = editor.state
    if (selection.node.type.name !== 'image') return

    const width = imageAttributes.size
    let style = ''

    switch (float) {
      case 'left':
        style = `float: left; margin: 0 1em 1em 0; width: ${width}% !important; height: auto !important;`
        break
      case 'right':
        style = `float: right; margin: 0 0 1em 1em; width: ${width}% !important; height: auto !important;`
        break
      case 'center':
      default:
        style = `display: block !important; margin-left: auto !important; margin-right: auto !important; margin-top: 1em; margin-bottom: 1em; float: none; width: ${width}% !important; height: auto !important;`
    }

    const transaction = editor.state.tr.setNodeMarkup(selection.from, undefined, {
      ...selection.node.attrs,
      'data-float': float,
      style,
    })

    editor.view.dispatch(transaction)
    editor.commands.focus()
    onChange(editor.getHTML())
    setImageAttributes(prev => ({ ...prev, float }))
  }, [editor, onChange, imageAttributes.size])

  const updateImageAttribute = useCallback((attr: 'alt' | 'link', value: string) => {
    if (!editor?.state || !isNodeSelection(editor.state.selection)) return

    const { selection } = editor.state
    if (selection.node.type.name !== 'image') return

    const attrs = attr === 'link' 
      ? { 'data-link': value, class: value ? 'editor-image cursor-pointer' : 'editor-image' }
      : { [attr]: value }

    editor.chain().focus().updateAttributes('image', attrs).run()
    setImageAttributes(prev => ({ ...prev, [attr === 'link' ? 'link' : attr]: value }))
  }, [editor])

  return { updateImageSize, updateImageFloat, updateImageAttribute }
}

const ImageToolbar = ({ editor, onChange }: ImageToolbarProps) => {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const { isImageSelected, imageAttributes, setImageAttributes } = useImageSelection(editor)
  const { updateImageSize, updateImageFloat, updateImageAttribute } = useImageUpdates(
    editor,
    onChange,
    imageAttributes,
    setImageAttributes
  )

  const imageSizeOptions = [
    { value: '15', label: '15%' },
    { value: '25', label: '25%' },
    { value: '30', label: '30%' },
    { value: '50', label: '50%' },
    { value: '75', label: '75%' },
    { value: '100', label: '100%' },
  ]

  if (!editor?.isEditable || !isImageSelected) return null

  const imageElement = editor.view.dom.querySelector('.ProseMirror-selectednode')
  const editorContainer = editor.view.dom.closest('.ProseMirror')
  
  if (!imageElement || !editorContainer) return null

  const imageRect = imageElement.getBoundingClientRect()

  const floatButtons = [
    { value: 'left' as const, icon: AlignLeft, tooltip: 'Float left' },
    { value: 'center' as const, icon: AlignCenter, tooltip: 'Center' },
    { value: 'right' as const, icon: AlignRight, tooltip: 'Float right' },
  ]

  return (
    <div 
      className="image-toolbar fixed bg-[#212124] border border-border rounded-lg z-50 p-[0.5rem] -translate-x-1/2 flex items-center gap-2"
      style={{
        top: `${imageRect.bottom + 8}px`,
        left: `${imageRect.left + (imageRect.width / 2)}px`,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Input
        type="text"
        placeholder="Alt text"
        value={imageAttributes.alt}
        onChange={(e) => updateImageAttribute('alt', e.target.value)}
        className="w-32"
      />
      
      <div className="flex items-center gap-1">
        <Tooltip content="Image size">
          <div className="w-24 flex items-center">
            <Select
              value={imageAttributes.size}
              onValueChange={(value) => {
                updateImageSize(value)
              }}
            >
              <Select.Trigger>
                <Select.Value placeholder="Size" />
              </Select.Trigger>
              <Select.Content>
                {imageSizeOptions.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </div>
        </Tooltip>

        <div className="h-6 w-px bg-border mx-1" />

        {floatButtons.map(({ value, icon: Icon, tooltip }) => (
          <Tooltip key={value} content={tooltip}>
            <CustomButton
              active={editor.isActive('image', { 'data-float': value })}
              onClick={() => updateImageFloat(value)}
              tooltip={tooltip}
            >
              <Icon className="w-4 h-4" />
            </CustomButton>
          </Tooltip>
        ))}

        <div className="h-6 w-px bg-border mx-1" />

        <Tooltip content="Add link">
          <CustomButton
            active={editor.isActive('image', { 'data-link': imageAttributes.link })}
            onClick={() => setShowLinkInput(!showLinkInput)}
            tooltip="Add link"
          >
            <ExternalLink className="w-4 h-4" />
          </CustomButton>
        </Tooltip>
      </div>

      {showLinkInput && (
        <div className="absolute top-full left-0 mt-2 w-full bg-base backdrop-blur border border-border rounded-lg p-2">
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter URL"
              value={imageAttributes.link}
              onChange={(e) => setImageAttributes(prev => ({ ...prev, link: e.target.value }))}
            />
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                updateImageAttribute('link', imageAttributes.link)
                setShowLinkInput(false)
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageToolbar 