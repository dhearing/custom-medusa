import { Button } from "@medusajs/ui"
import { Trash, DotsSix } from "@medusajs/icons"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { SliderImage } from "../types"
import type { AnimateLayoutChanges } from "@dnd-kit/sortable"
import { usePrompt } from "@medusajs/ui"
import { memo } from 'react'

interface SortableSliderImageProps {
  item: SliderImage
  onDelete: (item: SliderImage) => void
  animateLayoutChanges?: AnimateLayoutChanges
  isDragging?: boolean
}

const SortableSliderImage = memo(({ 
  item, 
  onDelete, 
  animateLayoutChanges,
  isDragging 
}: SortableSliderImageProps) => {
  const prompt = usePrompt()
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ 
    id: item.id,
    animateLayoutChanges
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent modal from opening
    
    const shouldDelete = await prompt({
      title: "Delete Slide",
      description: "Are you sure you want to delete this slide? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger"
    })

    if (shouldDelete) {
      onDelete(item)
    }
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className="cursor-pointer rounded-md border border-ui-border-base hover:border-ui-border-hover transition-colors"
    >
      <div className="flex flex-row items-center gap-x-6 p-2">
        {item.src && (
          <div className="flex h-[100px] w-[150px] items-center justify-center">
            <img 
              src={item.src} 
              alt={item.alt_text || "Preview"}
              className="h-full w-full object-contain rounded-md" 
            />
          </div>
        )}
        <div className="flex flex-row items-center gap-x-2">
          <Button
            variant="secondary"
            size="small"
            onClick={handleDelete}
            className="transition-colors"
          >
            <Trash className="text-white" />
          </Button>
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-move p-2 hover:bg-ui-bg-base rounded-md transition-colors"
          >
            <DotsSix className="text-white" />
          </div>
        </div>
      </div>
    </div>
  )
})

SortableSliderImage.displayName = 'SortableSliderImage'

export default SortableSliderImage