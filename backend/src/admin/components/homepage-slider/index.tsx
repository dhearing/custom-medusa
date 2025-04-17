import { Container, Heading, Button } from "@medusajs/ui"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable"
import SortableSliderImage from "./sortable-image"
import StatusBadge from "../common/status-badge"
import { useSliderManagement } from "./hooks"
import { SliderModal } from "./modal"
import { memo } from 'react'

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, isDragging } = args;
  return isSorting || isDragging ? defaultAnimateLayoutChanges(args) : true;
};

const AddSlideButton = memo(({ onClick }: { onClick: () => void }) => (
  <div className="rounded-lg border border-dashed border-ui-border-base bg-ui-bg-subtle flex items-center justify-center">
    <Button 
      variant="secondary" 
      onClick={onClick}
      className="flex items-center gap-x-2"
    >
      <span className="text-xl">+</span>
      Add Slide
    </Button>
  </div>
))

AddSlideButton.displayName = 'AddSlideButton'

const HomepageSlider = () => {
  const {
    sortedSliderImages,
    status,
    hasChanges,
    error,
    handleDelete,
    handleDragEnd: onDragEnd,
    handleSave,
    isModalOpen,
    setIsModalOpen,
    selectedSlide,
    setSelectedSlide,
  } = useSliderManagement()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setSelectedSlide(sortedSliderImages.find(item => item.id === event.active.id))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setSelectedSlide(undefined)
    onDragEnd(event)
  }

  if (error) {
    return (
      <Container className="w-full">
        <div className="flex flex-col gap-y-4 p-4">
          <div className="text-red-500">
            Error: {error.message}
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container className="w-full">
      <div className="flex flex-col gap-y-4 p-4">
        <div className="flex items-center justify-between">
          <Heading level="h2">Homepage Slider Editor</Heading>
          <div className="flex items-center gap-x-2">
            <div className="min-w-[150px] flex justify-end">
              <StatusBadge status={status} />
            </div>
            <Button 
              onClick={() => handleSave()}
              variant="primary"
              disabled={status === "loading" || !hasChanges}
            >
              {status === "loading" ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSliderImages.map(item => item.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 auto-rows-fr">
                {sortedSliderImages?.map((item) => (
                  <div key={item.id} onClick={() => {
                    setSelectedSlide(item)
                    setIsModalOpen(true)
                  }}>
                    <SortableSliderImage
                      item={item}
                      onDelete={handleDelete}
                      animateLayoutChanges={animateLayoutChanges}
                      isDragging={selectedSlide?.id === item.id}
                    />
                  </div>
                ))}
                <AddSlideButton 
                  onClick={() => {
                    setSelectedSlide(undefined)
                    setIsModalOpen(true)
                  }}
                />
              </div>
            </SortableContext>

            <DragOverlay adjustScale={true}>
              {selectedSlide ? (
                <div className="opacity-50">
                  <SortableSliderImage
                    item={selectedSlide}
                    onDelete={handleDelete}
                    animateLayoutChanges={animateLayoutChanges}
                    isDragging={true}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
      <SliderModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setSelectedSlide(undefined)
        }}
        onSubmit={handleSave}
        initialData={selectedSlide}
        placement={sortedSliderImages.length + 1}
      />
    </Container>
  )
}

export default memo(HomepageSlider)