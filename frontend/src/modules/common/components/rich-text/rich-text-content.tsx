'use client'
import parse, { HTMLReactParserOptions, domToReact } from 'html-react-parser'
import { useEffect } from 'react'

interface RichTextContentProps {
  content: string
}

// Types
interface ImageAttributes {
  style?: string
  class?: string
  src: string
  alt?: string
  width?: string
  'data-width'?: string
  'data-float'?: 'left' | 'right' | 'center'
  contenteditable?: boolean
  [key: string]: any
}

interface FloatStyles {
  float?: 'left' | 'right'
  marginLeft?: string
  marginRight?: string
}

// Constants
const VIEWPORT_BREAKPOINTS = {
  MOBILE: 511,
  TABLET: 1023
} as const

const DEFAULT_IMAGE_WIDTH = 50

// Helper functions
const getTextAlign = (style?: string): string => {
  if (style?.includes('text-align')) {
    const alignMatch = style.match(/text-align:\s*(\w+)/)
    return alignMatch ? alignMatch[1] : 'left'
  }
  return 'left'
}

const calculateImageWidth = (attributes: ImageAttributes): number => {
  const { width, 'data-width': dataWidth, style } = attributes
  
  if (width) return parseInt(width) || DEFAULT_IMAGE_WIDTH
  if (dataWidth) return parseInt(dataWidth) || DEFAULT_IMAGE_WIDTH
  if (style) {
    const widthMatch = style.match(/width:\s*(\d+)%/)
    return widthMatch ? parseInt(widthMatch[1]) : DEFAULT_IMAGE_WIDTH
  }
  return DEFAULT_IMAGE_WIDTH
}

const getFloatStyles = (float?: string): FloatStyles => {
  switch (float) {
    case 'left':
      return { float: 'left', marginRight: '1rem' }
    case 'right':
      return { float: 'right', marginLeft: '1rem' }
    default:
      return { marginLeft: 'auto', marginRight: 'auto' }
  }
}

const getViewportInfo = (finalWidth: number) => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return {
      renderedWidth: `${finalWidth}%`,
      viewType: 'Desktop'
    }
  }

  const viewportWidth = window.innerWidth
  let renderedWidth = `${finalWidth}%`
  let viewType = 'Desktop'

  if (viewportWidth <= VIEWPORT_BREAKPOINTS.MOBILE) {
    renderedWidth = '100%'
    viewType = 'Mobile'
  } else if (viewportWidth <= VIEWPORT_BREAKPOINTS.TABLET) {
    renderedWidth = '35%'
    viewType = 'Tablet'
  }

  return { renderedWidth, viewType }
}

// Components
const RichTextParagraph = ({ attribs, children }: { attribs: any, children: any }) => {
  const { style, class: className, ...rest } = attribs
  const textAlign = getTextAlign(style)

  const paragraphStyle = {
    display: 'block',
    width: '100%',
    margin: '0.5em 0',
    minHeight: 'min-content',
    textAlign,
    clear: 'none',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    position: 'relative'
  }

  return (
    <p
      {...rest}
      className={`${className || ''} relative`}
      style={paragraphStyle}
    >
      {children}
    </p>
  )
}

const RichTextImage = ({ attribs }: { attribs: ImageAttributes }) => {
  const { style: originalStyle, class: className, src, alt, 'data-float': float, contenteditable, ...rest } = attribs
  const finalWidth = calculateImageWidth(attribs)
  const { renderedWidth, viewType } = getViewportInfo(finalWidth)

  // Parse original style if it exists
  let originalFloatValue = null;
  if (originalStyle) {
    const floatMatch = originalStyle.match(/float:\s*(\w+)/);
    originalFloatValue = floatMatch ? floatMatch[1] : null;
  }

  const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    float: float as 'left' | 'right' | undefined,
    width: renderedWidth,
    margin: float === 'left' 
      ? '0.5em 1em 1em 0'
      : float === 'right'
      ? '0.5em 0 1em 1em'
      : '0.5em auto',
    shapeOutside: float ? 'margin-box' : undefined,
    shapeMargin: float ? '1em' : undefined,
    position: 'relative' as const,
    zIndex: 1
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      className={`responsive-image ${className || ''}`}
      style={imageStyle}
      draggable={false}
      data-float={float}
      {...rest}
    />
  )
}

const RichTextLink = ({ attribs, children }: { attribs: any, children: any }) => {
  const { style, class: className, href, ...rest } = attribs
  return (
    <a
      {...rest}
      href={href}
      className={`${className || ''}`}
      style={{
        color: '#007AE8',
        textDecoration: 'underline',
        cursor: 'pointer'
      }}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

const RichTextContent = ({ content }: RichTextContentProps) => {
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const viewType = width <= VIEWPORT_BREAKPOINTS.MOBILE ? 'Mobile' :
                      width <= VIEWPORT_BREAKPOINTS.TABLET ? 'Tablet' :
                      'Desktop'
      const viewWidth = width <= VIEWPORT_BREAKPOINTS.MOBILE ? '100%' :
                       width <= VIEWPORT_BREAKPOINTS.TABLET ? '35%' :
                       'set width'
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const parseOptions: HTMLReactParserOptions = {
    replace: (domNode: any) => {
      if (domNode.type === 'tag') {
        const children = domToReact(domNode.children, parseOptions)

        switch (domNode.name) {
          case 'p':
            return <RichTextParagraph attribs={domNode.attribs} children={children} />
          case 'img':
            if (!domNode.parent?.attribs?.class?.includes('image-container')) {
              return <RichTextImage attribs={domNode.attribs} />
            }
            break
          case 'a':
            return <RichTextLink attribs={domNode.attribs} children={children} />
        }
      }
    }
  }

  const containerStyle = {
    display: 'flow-root',
    position: 'relative' as const,
    width: '100%',
    isolation: 'isolate' as const,
    overflow: 'hidden' as const
  }

  return (
    <div 
      className="prose prose-lg max-w-none prose-ul:my-4 prose-ol:my-4 prose-li:my-0 prose-li:marker:text-ui-fg-base" 
      style={containerStyle}
    >
      {parse(content, parseOptions)}
    </div>
  )
}

export default RichTextContent 