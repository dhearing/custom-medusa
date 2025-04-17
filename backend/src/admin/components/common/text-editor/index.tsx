import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Mark, mergeAttributes } from '@tiptap/core'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import { Button } from '@medusajs/ui'
import { EditorProps } from './types'
import MenuBar from './components/MenuBar'
import ImageToolbar from './components/ImageToolbar'
import CustomImage from './extensions/CustomImage'
import './styles/editor.css'

// Create a custom mark for font size
const FontSize = Mark.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle']
    }
  },

  addAttributes() {
    return {
      size: {
        default: null,
        parseHTML: element => element.style.fontSize?.replace('px', ''),
        renderHTML: attributes => {
          if (!attributes.size) return {}
          return {
            style: `font-size: ${attributes.size}px`,
            class: 'custom-font-size'
          }
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        style: 'font-size',
        getAttrs: value => {
          if (!value) return false
          return {
            size: value.replace('px', '')
          }
        }
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    if (!HTMLAttributes.size) return ['span', 0]
    return ['span', mergeAttributes(HTMLAttributes), 0]
  }
})

const TextEditor = ({ value, onChange, onSave }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'editor-paragraph',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'editor-ordered-list',
          },
          itemTypeName: 'listItem',
          keepMarks: true,
          keepAttributes: true,
        },
      }) as any,
      FontSize,
      TextStyle.configure({
        HTMLAttributes: {
          class: 'editor-text-style',
        },
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'image'],
      }),
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
      Highlight.configure({
        HTMLAttributes: {
          style: 'background-color: #ffff00; color: #000000',
        },
      }),
      Typography,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline',
        },
      }),
      CustomImage.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  })

  useEffect(() => {
    if (!editor) return

    const updateInitialImageSizes = () => {
      const images = editor.view.dom.querySelectorAll('img.editor-image')
      images.forEach((element: Element) => {
        const img = element as HTMLImageElement
        if (!img.hasAttribute('data-width')) {
          const containerWidth = img.parentElement?.offsetWidth || img.width
          const widthPercent = Math.min(100, Math.max(1, Math.round((img.width / containerWidth) * 100)))
          
          // Set initial width attributes
          img.setAttribute('width', `${widthPercent}%`)
          img.setAttribute('data-width', widthPercent.toString())
          img.style.width = `${widthPercent}%`
          
          // Dispatch event to update toolbar
          const sizeUpdateEvent = new CustomEvent('image-size-update', {
            detail: { size: widthPercent.toString() },
            bubbles: true
          })
          img.dispatchEvent(sizeUpdateEvent)
        }
      })
    }

    // Run on initial load
    updateInitialImageSizes()

    // Also run when content changes
    const observer = new MutationObserver(updateInitialImageSizes)
    observer.observe(editor.view.dom, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src']
    })

    return () => observer.disconnect()
  }, [editor])

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  const handleSave = async () => {
    if (!editor || !onSave) return

    try {
      const content = editor.getHTML()
      await onSave(content)
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  return (
    <div className="min-h-[200px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] border rounded-lg border-border bg-base">
      <MenuBar editor={editor} />
      <div className="p-4 relative prose prose-lg max-w-none">
        <ImageToolbar editor={editor} onChange={onChange} />
        <EditorContent editor={editor} />
      </div>
      {onSave && (
        <div className="border-t border-border p-2 flex justify-end">
          <Button
            variant="primary"
            size="small"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  )
}

export default TextEditor