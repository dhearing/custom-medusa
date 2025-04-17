import { FocusModal, Button, Badge } from "@medusajs/ui"
import { useState, useEffect, useMemo } from "react"
import { convertGoogleDriveUrl } from "../../../lib/convertURL"
import { SliderImage } from "../types"
import { SliderForm } from "../components/SliderForm"

interface ImageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (imageData: SliderImage) => void
  initialData?: SliderImage
  placement?: number
}

const INITIAL_SLIDER_STATE: Partial<SliderImage> = {
  id: "",
  src: "",
  alt_text: "",
  link: "",
  placement: undefined
}

export const SliderModal = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  placement 
}: ImageModalProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [imageData, setImageData] = useState<Partial<SliderImage>>(INITIAL_SLIDER_STATE)
  const [imageError, setImageError] = useState(false)  

  useEffect(() => {
    if (open) {
      setImageData(initialData || { ...INITIAL_SLIDER_STATE, placement })
      setImageError(false)
      setStatus("idle")
    }
  }, [initialData, placement, open])

  const hasChanges = useMemo(() => {
    if (!initialData) return true // Always allow saving for new slides
    
    return (
      imageData.src !== initialData.src ||
      imageData.alt_text !== initialData.alt_text ||
      imageData.link !== initialData.link
    )
  }, [imageData, initialData])

  const isFormValid = useMemo(() => {
    return !!(imageData.src && imageData.alt_text && imageData.link)
  }, [imageData])

  const handleInputChange = (field: keyof SliderImage, value: string) => {
    if (field === "src") {
      setImageError(false)
      const convertedUrl = convertGoogleDriveUrl(value)
      setImageData((prev) => ({ ...prev, [field]: convertedUrl }))
    } else {
      setImageData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async () => {
    try {
      setStatus("loading")
      await onSubmit(imageData as SliderImage)
      setStatus("success")
      setTimeout(() => {
        onOpenChange(false)
      }, 1500)
    } catch (error) {
      console.error("Error saving resource:", error)
      setStatus("error")
    }
  }

  const handleClose = () => {
    if (status !== "loading") {
      onOpenChange(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setStatus("idle")
      setImageData(INITIAL_SLIDER_STATE)
      setImageError(false)
    }
  }, [open])

  const renderStatusBadge = () => {
    switch (status) {
      case "success":
        return <Badge color="green">Saved successfully</Badge>
      case "error":
        return <Badge color="red">Error saving</Badge>
      default:
        return null
    }
  }

  return (
    <FocusModal open={open} onOpenChange={handleClose}>
      <FocusModal.Content className="max-w-[500px] max-h-fit mx-auto">
        <FocusModal.Header>
          <FocusModal.Title>
            {initialData ? "Edit Slide" : "Add New Slide"}
          </FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Description className="hidden">
          Fill in the details to add a new slide
        </FocusModal.Description>
        
        <FocusModal.Body className="flex flex-col gap-y-4 py-4 px-6">
          <SliderForm
            imageData={imageData}
            onInputChange={handleInputChange}
            onImageError={() => setImageError(true)}
            imageError={imageError}
          />
        </FocusModal.Body>
        
        <FocusModal.Footer>
          <div className="flex gap-x-2 justify-end">
            {status !== "idle" && (
              <div className="flex justify-center">
                {renderStatusBadge()}
              </div>
            )}
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={status === "loading"}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={
                status === "loading" ||
                status === "success" ||
                !isFormValid ||
                (initialData && !hasChanges)
              }
            >
              {status === "loading" ? "Saving..." : 
               status === "success" ? "Saved!" : 
               initialData ? "Save Changes" : "Save"}
            </Button>
          </div>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
} 