import { Input, Button } from "@medusajs/ui"
import { Trash, DotsSix } from "@medusajs/icons"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { SortableMenuItemProps } from "../../../../types"

export const SortableMenuItem = ({ item, index, updateMenuItem, deleteMenuItem }: SortableMenuItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="flex gap-x-8 items-center border border-ui-border-subtlest rounded-md p-4"
    >
      <div className="flex-1 flex gap-x-8">
        <Input
          placeholder="Title"
          value={item.title}
          onChange={(e) => updateMenuItem(index, "title", e.target.value)}
        />
        <Input
          placeholder="Link"
          value={item.link}
          onChange={(e) => updateMenuItem(index, "link", e.target.value)}
        />
      </div>
      <div className="flex items-center flex-row gap-x-4">
        <Button
          variant="secondary"
          size="small"
          onClick={() => deleteMenuItem(index)}
        >
          <Trash className="text-ui-fg-subtle" />
        </Button>
        <div {...attributes} {...listeners} className="cursor-move">
          <DotsSix className="text-ui-fg-subtle" />
        </div>
      </div>
    </div>
  )
} 