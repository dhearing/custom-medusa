import { useState, useEffect, useMemo } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"

// Define types for contact form submissions
export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  created_at: string
  // status: "read" | "unread"
}

interface DeleteItem {
  id: string
}

interface ApiResponse<T> {
  status: "success" | "error"
  data?: T
  error?: string
}

interface ApiSuccessResponse<T> {
  status: "success"
  data: T
}

export const useContactManagement = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | undefined>(undefined)
  const [contactToDelete, setContactToDelete] = useState<ContactSubmission | undefined>(undefined)

  const sortedContacts = useMemo(() => {
    return [...contacts].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }, [contacts])

  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10
  const pageCount = Math.ceil(sortedContacts.length / pageSize)
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
    const limit = Math.min(offset + pageSize, sortedContacts.length)

    return sortedContacts.slice(offset, limit)
  }, [currentPage, pageSize, sortedContacts])

  // Fetch contact submissions
  const { data: contactSubmissions } = useQuery<ContactSubmission[]>({
    queryFn: async () => {
      const response = await sdk.client.fetch("/admin/contact-us") as ApiResponse<ContactSubmission[]>
      if (response.status === 'error') {
        throw new Error(response.error)
      }
      return response.data || []
    },
    queryKey: ["contact-us"],
  })

  // Delete contact submission
  const { mutateAsync: remove } = useMutation<ApiSuccessResponse<{ message: string }>, Error, DeleteItem[]>({
    mutationFn: async (payload) => {
      const response = await sdk.client.fetch(`/admin/contact-us`, {
        method: "delete",
        body: payload
      }) as ApiResponse<{ message: string }>
      
      if (response.status === 'error') {
        throw new Error(response.error)
      }
      return response as ApiSuccessResponse<{ message: string }>
    }
  })

  // Update contact status
  // const { mutateAsync: updateStatus } = useMutation<ApiSuccessResponse<ContactSubmission>, Error, { id: string, status: "read" | "unread" }>({
  //   mutationFn: async (payload) => {
  //     const response = await sdk.client.fetch(`/admin/contact-us/${payload.id}/status`, {
  //       method: "put",
  //       body: { status: payload.status }
  //     }) as ApiResponse<ContactSubmission>
      
  //     if (response.status === 'error') {
  //       throw new Error(response.error)
  //     }
  //     return response as ApiSuccessResponse<ContactSubmission>
  //   },
  //   onSuccess: () => {
  //     refetch()
  //   }
  // })

  useEffect(() => {
    if (contactSubmissions) {
      setContacts(contactSubmissions)
    }
  }, [contactSubmissions])

  // Mark contact as read when viewing
  // useEffect(() => {
  //   if (selectedContact && selectedContact.status === "unread") {
  //     updateStatus({ id: selectedContact.id, status: "read" })
  //       .then(() => {
  //         setContacts(prev => prev.map(item => 
  //           item.id === selectedContact.id ? { ...item, status: "read" } : item
  //         ))
  //       })
  //       .catch(error => console.error("Error updating contact status:", error))
  //   }
  // }, [selectedContact])

  const handleDelete = async () => {
    if (!contactToDelete) return

    try {
      setStatus("loading")
      const deleteResponse = await remove([{ id: contactToDelete.id }])
      
      if (deleteResponse.status !== "success") {
        throw new Error("Failed to delete contact submission")
      }

      setContacts(prev => prev.filter(item => item.id !== contactToDelete.id))
      setStatus("success")
    } catch (error) {
      console.error("Error deleting contact submission:", error)
      setStatus("error")
    } finally {
      setContactToDelete(undefined)
      setTimeout(() => setStatus("idle"), 2000)
    }
  }

  return {
    sortedContacts,
    isModalOpen,
    selectedContact,
    contactToDelete,
    setIsModalOpen,
    setSelectedContact,
    setContactToDelete,
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

export type ContactManagement = ReturnType<typeof useContactManagement> 