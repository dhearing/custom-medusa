import { useState, useEffect, useMemo } from "react"
import { FocusModal, Label, Input, Textarea, Button, Select, Switch, Badge } from "@medusajs/ui"
import { BlogResourceItem, ApiResponse, ApiSuccessResponse } from "../../../../../types"
import TextEditor from "../../../common/text-editor"
import { useMutation } from "@tanstack/react-query"
import { sdk } from "../../../../lib/sdk"

interface ResourceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (resource: Partial<BlogResourceItem>) => void
  initialResource?: BlogResourceItem
}

const INITIAL_RESOURCE_STATE: Partial<BlogResourceItem> = {
  title: "",
  description: "",
  content: "",
  main_image: "",
  link: "",
  author: "",
  category: "",
  status: true,
  views: 0
}

const ResourceModal = ({ open, onOpenChange, onSubmit, initialResource }: ResourceModalProps) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [resource, setResource] = useState<Partial<BlogResourceItem>>(INITIAL_RESOURCE_STATE)

  const { mutateAsync: post } = useMutation<ApiSuccessResponse<{ message: string }>, Error, BlogResourceItem>({
    mutationFn: async (payload) => {
      const response = await sdk.client.fetch(`/admin/blogs-resources`, {
        method: "post",
        body: [payload]
      }) as ApiResponse<{ message: string }>
      
      if (response.status === 'error') {
        throw new Error(response.error)
      }
      return response as ApiSuccessResponse<{ message: string }>
    }
  })

  // Reset form when initialResource changes
  useEffect(() => {
    setResource(initialResource || INITIAL_RESOURCE_STATE)
  }, [initialResource])

  const hasChanges = useMemo(() => {
    if (!initialResource) return true // Always allow saving for new resources
    
    return (
      resource.title !== initialResource.title ||
      resource.description !== initialResource.description ||
      resource.content !== initialResource.content ||
      resource.main_image !== initialResource.main_image ||
      resource.link !== initialResource.link ||
      resource.author !== initialResource.author ||
      resource.category !== initialResource.category ||
      resource.status !== initialResource.status
    )
  }, [resource, initialResource])

  const isFormValid = useMemo(() => {
    return !!(
      resource.title &&
      resource.description &&
      resource.category &&
      resource.link &&
      resource.author &&
      resource.content &&
      resource.main_image
    )
  }, [resource])

  const handleInputChange = (field: keyof BlogResourceItem, value: string | boolean) => {
    setResource((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async() => {
    try {
      setStatus("loading")
      const response = await post(resource as BlogResourceItem)
      
      if (response.status !== "success") {
        throw new Error("Failed to update resource")
      }

      setStatus("success")
      onSubmit(resource)
      
      setTimeout(() => {
        onOpenChange(false)
        setStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Error saving resource:", error)
      setStatus("error")
      setTimeout(() => setStatus("idle"), 2000)
    }
  }

  const renderFormFields = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4 px-10">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title"
          value={resource.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter title"
        />
      </div>
      <div>
        <Label htmlFor="link">Link</Label>
        <Input
          id="link"
          value={resource.link}
          onChange={(e) => handleInputChange("link", e.target.value)}
          placeholder="Enter link"
        />
      </div>
      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={resource.author}
          onChange={(e) => handleInputChange("author", e.target.value)}
          placeholder="Enter author"
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select 
          value={resource.category}
          onValueChange={(value) => handleInputChange("category", value)}
        >
          <Select.Trigger>
            <Select.Value placeholder="Please select" />
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="Blog">Blog</Select.Item>
            <Select.Item value="Resource">Resource</Select.Item>
          </Select.Content>
        </Select>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={resource.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter description"
          rows={4}
        />
      </div>
      <div>
        <Label htmlFor="main_image">Main Image URL</Label>
        <Input
          id="main_image"
          value={resource.main_image}
          onChange={(e) => handleInputChange("main_image", e.target.value)}
          placeholder="Enter image URL"
        />
      </div>
    </div>
  )

  const renderStatusBadge = () => {
    if (status === "success") return <Badge color="green">Saved successfully</Badge>
    if (status === "error") return <Badge color="red">Error saving</Badge>
    return null
  }

  return (
    <FocusModal 
      open={open} 
      onOpenChange={(newOpen) => {
        if (status !== "loading" && status !== "success") {
          onOpenChange(newOpen)
        }
      }}
    >
      <FocusModal.Content>
        <FocusModal.Header>
          <FocusModal.Title>
            <div className="flex flex-row items-center gap-x-4">
              {initialResource ? `Editing: ${resource.title}` : "New Blog or Resource"}
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                  <Switch
                    id="status"
                    checked={resource.status}
                    onCheckedChange={(checked) => handleInputChange("status", checked)}
                  />
                  <span className={`${resource.status ? "text-green-500" : "text-blue-500"}`}>
                    {resource.status ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            </div>
          </FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Description className="hidden">
          Fill in the details to add a new blog post or resource
        </FocusModal.Description>
        <FocusModal.Body className="flex flex-col max-h-[calc(100vh-65px)]">
          <div className="flex-1 overflow-y-auto min-h-0">
            {renderFormFields()}
            <div className="py-4 px-10">
              <TextEditor 
                value={resource.content || ""}
                onChange={(value) => handleInputChange("content", value)}
              />
            </div>
          </div>
          <div className="sticky bottom-0 flex justify-end gap-x-2 p-4 border-t border-gray-500">
            <div className="min-w-[150px]">
              {renderStatusBadge()}
            </div>
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={status === "loading" || status === "success"}
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
                (initialResource && !hasChanges)
              }
            >
              {status === "loading" ? "Saving..." : 
               status === "success" ? "Saved!" : 
               initialResource ? "Save Changes" : "Add Resource"}
            </Button>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}

export default ResourceModal 