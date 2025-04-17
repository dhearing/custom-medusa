import { useState, useEffect, useMemo } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { 
  BlogResourceItem, 
  DeleteItem, 
  ApiResponse, 
  ApiSuccessResponse
} from "@src/types"
import { sdk } from "../../../lib/sdk"


export const useResourceManagement = () => {
  const [blogResources, setBlogResources] = useState<BlogResourceItem[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<BlogResourceItem | undefined>(undefined)
  const [resourceToDelete, setResourceToDelete] = useState<BlogResourceItem | undefined>(undefined)

  const sortedResources = useMemo(() => {
    return [...blogResources].sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
  }, [blogResources])

  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10
  const pageCount = Math.ceil(sortedResources.length / pageSize)
  const canNextPage = useMemo(
    () => currentPage < pageCount - 1,
    [currentPage, pageCount]
  )
  const canPreviousPage = useMemo(() => currentPage - 1 >= 0, [currentPage])

  const nextPage = () => {
    if (canNextPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (canPreviousPage) {
      setCurrentPage(currentPage - 1)
    }
  }

  const currentPageData = useMemo(() => {
    const offset = currentPage * pageSize
    const limit = Math.min(offset + pageSize, sortedResources.length)

    return sortedResources.slice(offset, limit)
  }, [currentPage, pageSize, sortedResources])

  const { data: blogsResourcesContent, refetch } = useQuery<BlogResourceItem[]>({
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/blogs-resources") as ApiResponse<BlogResourceItem[]>
      if (response.status === 'error') {
        throw new Error(response.error)
      }
      return response.data
    },
    queryKey: ["blogs-resources-content"],
  })

  const { mutateAsync: remove } = useMutation<ApiSuccessResponse<{ message: string }>, Error, DeleteItem[]>({
    mutationFn: async (payload) => {
      const response = await sdk.client.fetch(`/admin/blogs-resources`, {
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
    if (blogsResourcesContent) {
      setBlogResources(blogsResourcesContent)
    }
  }, [blogsResourcesContent])

  const handleSubmit = async (resource: Partial<BlogResourceItem>) => {
    if (selectedResource) {
      setBlogResources(prev => prev.map(item => 
        item.id === selectedResource.id ? { 
          ...item, 
          ...resource,
          status: resource.status !== undefined ? resource.status : item.status
        } : item
      ))
    } else {
      const newResourceItem = {
        ...resource,
        id: `resource-${Date.now()}`,
        status: resource.status !== undefined ? resource.status : true,
        views: 0,
      } as BlogResourceItem
      
      setBlogResources(prev => [...prev, newResourceItem])
    }
    await refetch()
  }

  const handleDelete = async () => {
    if (!resourceToDelete) return

    try {
      setStatus("loading")
      const deleteResponse = await remove([{ id: resourceToDelete.id }])
      
      if (deleteResponse.status !== "success") {
        throw new Error("Failed to delete items")
      }

      setBlogResources(prev => prev.filter(item => item.id !== resourceToDelete.id))
      setStatus("success")
    } catch (error) {
      console.error("Error deleting resource:", error)
      setStatus("error")
    } finally {
      setResourceToDelete(undefined)
      setTimeout(() => setStatus("idle"), 2000)
    }
  }

  return {
    sortedResources,
    isModalOpen,
    selectedResource,
    resourceToDelete,
    setIsModalOpen,
    setSelectedResource,
    setResourceToDelete,
    handleSubmit,
    handleDelete,
    currentPage,
    pageSize,
    pageCount,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    currentPageData,
    status
  }
}

export type ResourceManagement = ReturnType<typeof useResourceManagement> 