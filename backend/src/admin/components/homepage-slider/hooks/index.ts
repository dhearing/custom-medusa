import { useState, useEffect, useCallback, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { 
  DeleteItem, 
  ApiResponse, 
  ApiSuccessResponse,
  SliderImage,
  TrackedSliderImage
} from "../types"
import { sdk } from "../../../lib/sdk"
import { convertGoogleDriveUrl } from "../../../lib/convertURL"
import { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

const SLIDER_QUERY_KEY = "homepage-slider-content"

export const useSliderManagement = () => {
  const queryClient = useQueryClient()
  const [sliderImages, setSliderImages] = useState<TrackedSliderImage[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSlide, setSelectedSlide] = useState<SliderImage | undefined>(undefined)
  const [originalOrder, setOriginalOrder] = useState<string[]>([])

  const { data: images, error: fetchError } = useQuery<SliderImage[]>({
    queryKey: [SLIDER_QUERY_KEY],
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/homepage-slider") as ApiResponse<SliderImage[]>
      if (response.status === 'error') throw new Error(response.error)
      return response.data
    }
  })

  const { mutateAsync: post, error: postError } = useMutation<ApiSuccessResponse<{ message: string }>, Error, SliderImage[]>({
    mutationFn: async (payload) => {
      const response = await sdk.client.fetch(`/admin/homepage-slider`, {
        method: "post",
        body: payload
      }) as ApiResponse<{ message: string }>
      if (response.status === 'error') throw new Error(response.error)
      return response as ApiSuccessResponse<{ message: string }>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SLIDER_QUERY_KEY] })
    }
  })

  const { mutateAsync: remove, error: removeError } = useMutation<ApiSuccessResponse<{ message: string }>, Error, DeleteItem[]>({
    mutationFn: async (payload) => {
      const response = await sdk.client.fetch(`/admin/homepage-slider`, {
        method: "delete",
        body: payload
      }) as ApiResponse<{ message: string }>
      if (response.status === 'error') throw new Error(response.error)
      return response as ApiSuccessResponse<{ message: string }>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SLIDER_QUERY_KEY] })
    }
  })

  useEffect(() => {
    if (!images) return
    const items = images
      .map((item: SliderImage) => ({
        ...item,
        id: item.id || `item-${Date.now()}-${Math.random()}`,
        src: convertGoogleDriveUrl(item.src),
        status: 'unchanged' as const
      }))
      .sort((a, b) => a.placement - b.placement)
    setSliderImages(items)
    setOriginalOrder(items.map(item => item.id))
  }, [images])

  const updateImage = useCallback((index: number, field: "src" | "link" | "alt_text", value: string) => {
    setSliderImages(prev => {
      const updatedItems = [...prev]
      updatedItems[index] = { 
        ...updatedItems[index], 
        [field]: field === "src" ? convertGoogleDriveUrl(value) : value,
        status: updatedItems[index].status === 'new' ? 'new' : 'updated'
      }
      return updatedItems
    })
  }, [])

  const handleDelete = useCallback(async (itemToDelete: SliderImage) => {
    try {
      setStatus("loading")
      await remove([{ id: itemToDelete.id }])

      // Update the sliderImages with new placements
      const updatedImages = sliderImages
        .filter(item => item.id !== itemToDelete.id)
        .map((item, index) => ({
          ...item,
          placement: index
        }))

      // Send the updated placements to the server
      await post(updatedImages)

      // After successful save, update local state
      setSliderImages(updatedImages.map(item => ({ ...item, status: 'unchanged' as const })))
      setOriginalOrder(updatedImages.map(item => item.id))
      
      setStatus("success")
    } catch (error) {
      console.error("Error deleting image:", error)
      setStatus("error")
    } finally {
      setTimeout(() => setStatus("idle"), 2000)
    }
  }, [sliderImages, remove, post])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setSliderImages(items => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      const reorderedItems = arrayMove(items, oldIndex, newIndex)
      
      return reorderedItems.map((item, index) => ({
        ...item,
        placement: index,
        status: 'updated' as const
      }))
    })
  }, [])

  const handleSave = useCallback(async (imageData?: SliderImage) => {
    try {
      setStatus("loading")
      
      // Prepare the update data
      const itemsToUpdate = imageData
        ? (selectedSlide 
            ? sliderImages.map(img => img.id === selectedSlide.id 
                ? { ...imageData, placement: img.placement, status: 'updated' as const } 
                : img)
            : [...sliderImages, { ...imageData, placement: sliderImages.length, status: 'new' as const }]) as TrackedSliderImage[]
        : sliderImages.map((item, index) => ({ ...item, placement: index, status: 'updated' as const }))

      // Prepare and send payload
      const payload = itemsToUpdate.map(({ status: _, ...item }) => ({
        ...item,
        placement: Number(item.placement)
      }))
      
      await post(payload)
      
      // Update local state after successful save
      setSliderImages(itemsToUpdate.map(item => ({ ...item, status: 'unchanged' as const })))
      setOriginalOrder(itemsToUpdate.map(item => item.id))
      setStatus("success")
      
      // Reset status after a delay
      setTimeout(() => {
        setStatus("idle")
      }, 2000)
      
    } catch (error) {
      console.error("Error saving slider images:", error)
      setStatus("error")
      // Reset error status after a delay
      setTimeout(() => {
        setStatus("idle")
      }, 2000)
      throw error // Re-throw to let modal handle the error
    }
  }, [sliderImages, selectedSlide, post])

  const hasOrderChanged = useMemo(() => {
    const currentOrder = sliderImages.map(item => item.id)
    return JSON.stringify(currentOrder) !== JSON.stringify(originalOrder)
  }, [sliderImages, originalOrder])

  const hasChanges = useMemo(() => {
    return sliderImages.some(item => item.status === 'new' || item.status === 'updated') || 
           hasOrderChanged
  }, [sliderImages, hasOrderChanged])

  const error = fetchError || postError || removeError

  return {
    sortedSliderImages: sliderImages,
    status,
    hasChanges,
    error,
    updateImage,
    handleDelete,
    handleDragEnd,
    handleSave,
    isModalOpen,
    setIsModalOpen,
    selectedSlide,
    setSelectedSlide,
  }
}

export type SliderManagement = ReturnType<typeof useSliderManagement>