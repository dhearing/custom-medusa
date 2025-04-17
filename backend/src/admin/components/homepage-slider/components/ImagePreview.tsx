import { FC } from 'react'

interface ImagePreviewProps {
  src: string
  onError: () => void
  hasError: boolean
}

export const ImagePreview: FC<ImagePreviewProps> = ({ src, onError, hasError }) => {
  return (
    <div className="flex justify-center relative aspect-[1.5] w-full rounded-lg overflow-hidden bg-ui-bg-subtle">
      {src ? (
        <img
          src={src}
          alt="Preview"
          onError={onError}
          className={`w-full object-contain ${hasError ? 'hidden' : ''}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-ui-fg-subtle">
          No image
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-ui-fg-subtle">
          Invalid image URL
        </div>
      )}
    </div>
  )
} 