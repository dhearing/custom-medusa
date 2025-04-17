import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { BLOG_RESOURCE_CONTENT_MODULE } from "src/modules/blogs-resources"
import BlogResourceService from '../../../modules/blogs-resources/service'
import { ApiResponse, BlogResourceItem } from "src/types"

const sendErrorResponse = (res: MedusaResponse, status: number, message: string): void => {
  res.status(status).json({
    status: 'error',
    error: message
  })
}

const sendSuccessResponse = <T>(res: MedusaResponse, data: T): void => {
  res.status(200).json({
    status: 'success',
    data
  })
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<ApiResponse<BlogResourceItem[]>>
): Promise<void> => {
  try {
    const blogResourceService = req.scope.resolve<BlogResourceService>(BLOG_RESOURCE_CONTENT_MODULE)
    const blogResourcesContent = await blogResourceService.listBlogResourceContents()

    if (!Array.isArray(blogResourcesContent)) {
      throw new Error('Invalid blog resources content format')
    }

    sendSuccessResponse(res, blogResourcesContent)
  } catch (error) {
    console.error('Error fetching blog resources content:', error)
    sendErrorResponse(res, 500, 'Internal server error')
  }
}

export const POST = async (
  req: MedusaRequest<BlogResourceItem[]>,
  res: MedusaResponse<ApiResponse<{ message: string }>>
): Promise<void> => {
  try {
    const blogResourceService = req.scope.resolve<BlogResourceService>(BLOG_RESOURCE_CONTENT_MODULE)
    const blogResources = req.body

    if (!Array.isArray(blogResources)) {
      sendErrorResponse(res, 400, 'Blog resources must be an array')
      return
    }

    if (blogResources.length === 0) {
      sendErrorResponse(res, 400, 'Blog resources array cannot be empty')
      return
    }

    const existingContent = await blogResourceService.listBlogResourceContents()
    const existingBlogResourceIds = new Set(existingContent.map(item => item.id))
    
    const blogResourcesToUpdate = blogResources.filter(item => existingBlogResourceIds.has(item.id))
    const blogResourcesToCreate = blogResources.filter(item => !existingBlogResourceIds.has(item.id))

    // Process updates and creations
    const operations: Promise<unknown>[] = []

    if (blogResourcesToUpdate.length) {
      operations.push(blogResourceService.updateBlogResourceContents(blogResourcesToUpdate))
    }

    if (blogResourcesToCreate.length) {
      operations.push(blogResourceService.createBlogResourceContents(blogResourcesToCreate))
    }

    await Promise.all(operations)
    sendSuccessResponse(res, { message: 'Blog resources updated successfully' })
  } catch (error) {
    console.error('Error updating blog resources content:', error)
    sendErrorResponse(res, 500, 'Internal server error')
  }
}

export const DELETE = async (
  req: MedusaRequest<{ id: string }[]>,
  res: MedusaResponse<ApiResponse<{ message: string }>>
): Promise<void> => {
  try {
    const blogResourceService = req.scope.resolve<BlogResourceService>(BLOG_RESOURCE_CONTENT_MODULE)
    const blogResourcesToDelete = req.body

    console.log("blogResourcesToDelete", blogResourcesToDelete)

    if (!Array.isArray(blogResourcesToDelete)) {
      sendErrorResponse(res, 400, 'Items to delete must be an array')
      return
    }

    if (blogResourcesToDelete.length === 0) {
      sendErrorResponse(res, 400, 'Items to delete array cannot be empty')
      return
    }

    // Validate that all items have an id
    const invalidItems = blogResourcesToDelete.filter(item => !item.id || typeof item.id !== 'string')
    if (invalidItems.length > 0) {
      sendErrorResponse(res, 400, 'All items must have a valid string id')
      return
    }

    await blogResourceService.deleteBlogResourceContents(blogResourcesToDelete)
    sendSuccessResponse(res, { message: 'Blog resources deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog resources content:', error)
    sendErrorResponse(res, 500, 'Internal server error')
  }
}