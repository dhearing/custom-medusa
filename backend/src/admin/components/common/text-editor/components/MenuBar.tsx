import { useState } from 'react'
import { Button, Tooltip } from '@medusajs/ui'
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
  Heading1, Heading2, Heading3, Link as LinkIcon,
  HighlighterIcon, Type, Undo, Redo, ImageIcon, Palette,
  Plus, Minus, WrapText
} from 'lucide-react'
import CustomButton from './CustomButton'
import { MenuBarProps } from '../types'
import { COLORS } from '../utils/constants'
import { Node as ProseMirrorNode } from 'prosemirror-model'

const MenuBar = ({ editor }: MenuBarProps) => {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const [showImageInput, setShowImageInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [currentFontSize, setCurrentFontSize] = useState(16)

  const toggleTextWrap = () => {
    if (!editor?.state) return

    const images: { node: ProseMirrorNode, pos: number }[] = []
    editor.state.doc.descendants((node: ProseMirrorNode, pos: number) => {
      if (node.type.name === 'image') {
        images.push({ node, pos })
      }
    })

    images.forEach(({ node, pos }) => {
      const isWrapped = node.attrs.class?.includes('text-wrap')
      const baseClass = 'editor-image'
      const newClass = isWrapped ? baseClass : `${baseClass} text-wrap`
      const newStyle = isWrapped
        ? 'width: 25% !important; height: auto !important;'
        : 'float: right; margin: 0 0 1em 1em; width: 25% !important; height: auto !important;'

      try {
        editor.chain()
          .setNodeSelection(pos)
          .updateAttributes('image', {
            class: newClass,
            style: newStyle,
            'data-float': isWrapped ? null : 'right'
          })
          .run()
      } catch (error) {
        console.error('Error updating image:', error)
      }
    })

    editor.commands.focus()
  }

  if (!editor) {
    return null
  }

  const isTextWrapActive = () => {
    if (!editor?.state) return false

    const { from, to } = editor.state.selection
    let hasWrappedImage = false

    editor.state.doc.nodesBetween(from, to, (node: ProseMirrorNode) => {
      if (node.type.name === 'image') {
        if (node.attrs.class?.includes('text-wrap') || node.attrs.style?.includes('float:')) {
          hasWrappedImage = true
        }
      }
    })

    return hasWrappedImage
  }

  const adjustFontSize = (increment: boolean) => {
    const newSize = increment ? currentFontSize + 1 : currentFontSize - 1;
    if (newSize >= 8 && newSize <= 72) {
      setCurrentFontSize(newSize);
      editor.chain().focus().unsetMark('fontSize').setMark('fontSize', { size: newSize }).run();
    }
  };

  const handleImageInsert = () => {
    if (!imageUrl.trim()) return

    let processedUrl = imageUrl
    if (imageUrl.includes('drive.google.com')) {
      if (imageUrl.includes('/file/d/')) {
        const fileId = imageUrl.match(/\/file\/d\/([^/]+)/)?.[1];
        if (fileId) {
          processedUrl = `https://lh3.googleusercontent.com/d/${fileId}`
        }
      } else if (imageUrl.includes('id=')) {
        const fileId = imageUrl.match(/id=([^&]+)/)?.[1];
        if (fileId) {
          processedUrl = `https://lh3.googleusercontent.com/d/${fileId}`
        }
      }
    }

    try {
      new URL(processedUrl);
    } catch (e) {
      console.error('Invalid URL:', processedUrl);
      alert('Please enter a valid URL');
      return;
    }

    editor.chain().focus().setImage({ 
      src: processedUrl,
      class: 'editor-image',
      alt: 'Image',
      draggable: 'true',
      'data-width': '100',
      width: '100%',
      style: 'width: 100% !important; height: auto !important;'
    }).run()
    
    setImageUrl('')
    setShowImageInput(false)
  }

  const isTextAlignActive = (align: 'left' | 'center' | 'right') => {
    if (!editor?.state) return false

    let hasFloatedImage = false
    let imageFloat = ''
    
    editor.state.doc.nodesBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      (node: ProseMirrorNode) => {
        if (node.type.name === 'image') {
          hasFloatedImage = true
          imageFloat = node.attrs['data-float']
        }
      }
    )

    if (hasFloatedImage) {
      if (imageFloat === 'left' && align === 'right') return true
      if (imageFloat === 'right' && align === 'left') return true
      return false
    }

    return editor.isActive({ textAlign: align })
  }

  return (
    <div className="border-b border-gray-200 p-2">
      <div className="flex flex-wrap items-center gap-1 mb-2">
        <CustomButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          tooltip="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          tooltip="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          tooltip="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          tooltip="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          tooltip="Highlight text"
        >
          <HighlighterIcon className="w-4 h-4" />
        </CustomButton>
        <div className="relative">
          <CustomButton
            onClick={() => setShowColors(!showColors)}
            tooltip="Text color"
          >
            <Palette className="w-4 h-4" />
          </CustomButton>
          {showColors && (
            <div className="absolute z-10 mt-2 w-32 bg-gray-500 border border-border rounded-lg shadow-lg">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-500 flex items-center gap-2"
                  onClick={() => {
                    editor.chain().focus().setColor(color.value).run()
                    setShowColors(false)
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: color.value }}
                  />
                  {color.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <CustomButton
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          tooltip="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          tooltip="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          tooltip="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={editor.isActive('paragraph')}
          onClick={() => editor.chain().focus().setParagraph().run()}
          tooltip="Normal text"
        >
          <Type className="w-4 h-4" />
        </CustomButton>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <CustomButton
          active={isTextAlignActive('left')}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          tooltip="Align left"
        >
          <AlignLeft className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={isTextAlignActive('center')}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          tooltip="Align center"
        >
          <AlignCenter className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={isTextAlignActive('right')}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          tooltip="Align right"
        >
          <AlignRight className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={isTextWrapActive()}
          onClick={toggleTextWrap}
          tooltip="Toggle text wrap"
        >
          <WrapText className="w-4 h-4" />
        </CustomButton>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <CustomButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          tooltip="Bullet list"
        >
          <List className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          tooltip="Numbered list"
        >
          <ListOrdered className="w-4 h-4" />
        </CustomButton>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <CustomButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          tooltip="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </CustomButton>
        <CustomButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          tooltip="Redo (Ctrl+Shift+Z)"
        >
          <Redo className="w-4 h-4" />
        </CustomButton>
        <div className="w-px h-6 bg-gray-200 mx-1" />
        <CustomButton
          active={editor.isActive('link')}
          onClick={() => setShowLinkInput(!showLinkInput)}
          tooltip="Add link"
        >
          <LinkIcon className="w-4 h-4" />
        </CustomButton>
        <div className="flex items-center gap-1 border border-border rounded-lg">
          <Tooltip content="Decrease font size">
            <CustomButton
              onClick={() => adjustFontSize(false)}
              tooltip="Decrease font size"
            >
              <Minus className="w-4 h-4" />
            </CustomButton>
          </Tooltip>
          <span className="text-sm px-2">{currentFontSize}px</span>
          <Tooltip content="Increase font size">
            <CustomButton
              onClick={() => adjustFontSize(true)}
              tooltip="Increase font size"
            >
              <Plus className="w-4 h-4" />
            </CustomButton>
          </Tooltip>
        </div>
        <CustomButton
          onClick={() => setShowImageInput(!showImageInput)}
          tooltip="Insert image from URL"
        >
          <ImageIcon className="w-4 h-4" />
        </CustomButton>        
      </div>
      {showLinkInput && (
        <div className="flex gap-2 mt-2">
          <input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
          />
          <Button variant="primary" size="small" onClick={() => {
            editor.chain().focus().setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setShowLinkInput(false)
          }}>
            Add Link
          </Button>
        </div>
      )}
      {showImageInput && (
        <div className="flex gap-2 mt-2">
          <div className="flex gap-2 w-full">
            <input
              type="url"
              placeholder="Enter image URL (e.g., Google Drive shared link)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-2 py-1 border rounded"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleImageInsert();
                }
              }}
            />
            <Button 
              variant="primary" 
              size="small" 
              onClick={(e) => {
                e.preventDefault();
                handleImageInsert();
              }}
            >
              Insert Image
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MenuBar 