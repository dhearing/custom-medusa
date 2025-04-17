import { Container, Heading, Button } from "@medusajs/ui"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableMenuItem } from "./sortable-menu"
import StatusBadge from "../common/status-badge"
import { useNavbarManagement } from "../../hooks"

const NavBar = () => {
  const {
    sortedMenuItems,
    status,
    hasChanges,
    updateMenuItem,
    deleteMenuItem,
    handleDragEnd,
    handleSave,
    addMenuItem
  } = useNavbarManagement()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <Container className="w-full">
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">Navigation Menu Editor</Heading>
          <div className="flex items-center gap-x-2">
            <div className="min-w-[150px] flex justify-end">
              <StatusBadge status={status} />
            </div>
            <Button 
              onClick={handleSave}
              variant="primary"
              disabled={status === "loading" || !hasChanges}
            >
              {status === "loading" ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedMenuItems.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-y-4">
              {sortedMenuItems.map((item, index) => (
                <SortableMenuItem
                  key={item.id}
                  item={item}
                  index={index}
                  updateMenuItem={updateMenuItem}
                  deleteMenuItem={deleteMenuItem}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="flex justify-end">
          <Button variant="secondary" onClick={addMenuItem}>
            Add Menu Item
          </Button>
        </div>
      </div>
    </Container>
  )
}

export default NavBar