import { FC } from 'react'
import { Label, Input } from "@medusajs/ui"
import { SliderImage } from "../types"
import { ImagePreview } from './ImagePreview'

interface SliderFormProps {
  imageData: Partial<SliderImage>
  onInputChange: (field: keyof SliderImage, value: string) => void
  onImageError: () => void
  imageError: boolean
}

export const SliderForm: FC<SliderFormProps> = ({
  imageData,
  onInputChange,
  onImageError,
  imageError
}) => {
  return (
    <div className="flex flex-col gap-y-4">
      <ImagePreview 
        src={imageData.src || ''} 
        onError={onImageError}
        hasError={imageError}
      />
      
      <div>
        <Label htmlFor="src">Image URL</Label>
        <Input
          id="src"
          type="text"
          value={imageData.src}
          onChange={(e) => onInputChange("src", e.target.value)}
          placeholder="Image URL"
        />
      </div>
      
      <div>
        <Label htmlFor="alt_text">Alt Text</Label>
        <Input
          id="alt_text"
          type="text"
          value={imageData.alt_text}
          onChange={(e) => onInputChange("alt_text", e.target.value)}
          placeholder="Alt Text"
        />
      </div>
      
      <div>
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          type="text"
          value={imageData.link}
          onChange={(e) => onInputChange("link", e.target.value)}
          placeholder="Link"
        />
      </div>
    </div>
  )
} 