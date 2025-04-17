import { useState, useEffect, useCallback } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { 
  DeleteItem, 
  ApiResponse, 
  ApiSuccessResponse,
  HomepageContent,
  MenuItem, 
  TrackedMenuItem,
} from "../../types"
import { sdk } from "../lib/sdk"
import { DragEndEvent } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"

type Status = "idle" | "loading" | "success" | "error"



export const useContentManagement = () => {
  const [status, setStatus] = useState<Status>("idle")
  const [content, setContent] = useState<HomepageContent>({ content: '' })
  const [originalContent, setOriginalContent] = useState<HomepageContent>({ content: '' })

  const { data: responseData } = useQuery<ApiResponse<HomepageContent>>({
    queryFn: () => sdk.client.fetch("/admin/homepage-content"),
    queryKey: ["homepage-content"],
  })

  const { mutateAsync } = useMutation({
    mutationFn: async (payload: HomepageContent) => {
      return sdk.client.fetch(`/admin/homepage-content`, {
        method: "post",
        body: payload
      })
    }
  })

  useEffect(() => {
    if (responseData?.status === 'success' && responseData.data) {
      setContent(responseData.data)
      setOriginalContent(responseData.data)
    }
  }, [responseData])

  const hasUnsavedChanges = content.content !== originalContent.content

  const handleContentChange = useCallback((value: string) => {
    setContent(prev => ({ ...prev, content: value }))
  }, [])

  const handleSubmit = async () => {
    try {
      setStatus("loading")
      const response = await mutateAsync(content) as ApiResponse
      
      if (response.status === "success") {
        setStatus("success")
        setOriginalContent(content)
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Error updating content:", error)
      setStatus("error")
    } finally {
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const isFormValid = content.content.trim() !== ''

  return {
    content,
    status,
    hasUnsavedChanges,
    isFormValid,
    handleContentChange,
    handleSubmit
  }
}

export const useNavbarManagement = () => {
  const [menuItems, setMenuItems] = useState<TrackedMenuItem[]>([])
  const [deletedItems, setDeletedItems] = useState<DeleteItem[]>([])
  const [status, setStatus] = useState<Status>("idle")

  const { data: navbarContent } = useQuery<MenuItem[]>({
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/navbar") as ApiResponse<MenuItem[]>
      if (response.status === 'error') {
        throw new Error(response.error)
      }
      return response.data
    },
    queryKey: ["navbar-content"],
  })

  const { mutateAsync: post } = useMutation<ApiSuccessResponse<{ message: string }>, Error, MenuItem[]>({
    mutationFn: async (payload) => {
      const response = await sdk.client.fetch(`/admin/navbar`, {
        method: "post",
        body: payload
      }) as ApiResponse<{ message: string }>
      
      if (response.status === 'error') {
        throw new Error(response.error)
      }
      return response as ApiSuccessResponse<{ message: string }>
    }
  })

  const { mutateAsync: remove } = useMutation<ApiSuccessResponse<{ message: string }>, Error, DeleteItem[]>({
    mutationFn: async (payload) => {
      const response = await sdk.client.fetch(`/admin/navbar`, {
        method: "delete",
        body: payload
      }) as ApiResponse<{ message: string }>
      
      if (response.status === 'error') {
        throw new Error(response.error)
      }
      return response as ApiSuccessResponse<{ message: string }>
    }
  })

  useEffect(() => {
    if (navbarContent) {
      const items = navbarContent
        .map((item: MenuItem) => ({
          ...item,
          id: item.id || `item-${item.placement}`,
          status: 'unchanged' as const
        }))
        .sort((a: TrackedMenuItem, b: TrackedMenuItem) => a.placement - b.placement)
      setMenuItems(items)
    }
  }, [navbarContent])

  const addMenuItem = useCallback(() => {
    const newItem = {
      title: "",
      link: "",
      placement: menuItems.length,
      id: `item-${Date.now()}`,
      status: 'new' as const
    }
    setMenuItems(prev => [...prev, newItem].sort((a, b) => a.placement - b.placement))
  }, [menuItems.length])

  const updateMenuItem = useCallback((index: number, field: "title" | "link", value: string) => {
    setMenuItems(prev => {
      const updatedItems = [...prev]
      updatedItems[index] = { 
        ...updatedItems[index], 
        [field]: value,
        status: updatedItems[index].status === 'new' ? 'new' : 'updated'
      }
      return updatedItems.sort((a, b) => a.placement - b.placement)
    })
  }, [])

  const deleteMenuItem = useCallback((index: number) => {
    setMenuItems(prev => {
      const updatedItems = prev.filter((_, i) => i !== index)
      return updatedItems.map((item, i) => ({
        ...item,
        placement: i
      })).sort((a, b) => a.placement - b.placement)
    })
    setDeletedItems(prev => [...prev, menuItems[index]])
  }, [menuItems])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setMenuItems(items => {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)
      const reorderedItems = arrayMove(items, oldIndex, newIndex)
      
      return reorderedItems.map((item, index) => ({
        ...item,
        placement: index,
        status: item.status === 'new' ? 'new' : 'updated'
      }))
    })
  }, [])

  const handleSave = async () => {
    try {
      setStatus("loading")

      if (deletedItems.length) {
        const itemsToDelete = deletedItems.map(({ id }) => ({ id }))
        const deleteResponse = await remove(itemsToDelete)
        
        if (deleteResponse.status !== "success") {
          throw new Error("Failed to delete items")
        }
        
        setDeletedItems([])
      }

      const itemsToUpdate = menuItems
        .filter(item => item.status === 'new' || item.status === 'updated')
        .map(({ status, ...item }) => item)

      if (itemsToUpdate.length) {
        const response = await post(itemsToUpdate)
        
        if (response.status !== "success") {
          throw new Error("Failed to update items")
        }

        setMenuItems(items => items.map(item => ({ 
          ...item, 
          status: 'unchanged' as const
        })))
      }

      setStatus("success")
    } catch (error) {
      console.error("Error saving menu items:", error)
      setStatus("error")
    } finally {
      setTimeout(() => setStatus("idle"), 3000)
    }
  }

  const sortedMenuItems = [...menuItems].sort((a, b) => a.placement - b.placement)
  const hasChanges = menuItems.some(item => item.status === 'new' || item.status === 'updated') || deletedItems.length > 0

  return {
    sortedMenuItems,
    status,
    hasChanges,
    updateMenuItem,
    deleteMenuItem,
    handleDragEnd,
    handleSave,
    addMenuItem
  }
}



export type NavbarManagement = ReturnType<typeof useNavbarManagement> 
export type ContentManagement = ReturnType<typeof useContentManagement>