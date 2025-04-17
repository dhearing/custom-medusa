import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { NAVBAR_CONTENT_MODULE } from "src/modules/navbar"
import NavBarService from '../../../modules/navbar/service'
import { 
  MenuItem, 
  MenuItemDelete,
  ApiResponse 
} from '../../../types'

const sendErrorResponse = (res: MedusaResponse, status: number, message: string): void => {
  res.status(status).json({
    status: 'error',
    error: message
  } as ApiResponse)
}

const sendSuccessResponse = <T>(res: MedusaResponse, data: T): void => {
  res.status(200).json({
    status: 'success',
    data
  } as ApiResponse<T>)
}

const validateMenuItems = (items: MenuItem[]): string | null => {
  if (!Array.isArray(items)) {
    return 'Menu items must be an array'
  }

  if (items.length === 0) {
    return 'Menu items array cannot be empty'
  }

  const invalidItems = items.filter(item => 
    !item.title?.trim() || 
    !item.link?.trim() || 
    typeof item.placement !== 'number'
  )

  if (invalidItems.length > 0) {
    return 'Invalid menu items found. Each item must have a non-empty title, link, and numeric placement'
  }

  return null
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<ApiResponse<MenuItem[]>>
): Promise<void> => {
  try {
    const navbarService = req.scope.resolve<NavBarService>(NAVBAR_CONTENT_MODULE)
    const navbarContent = await navbarService.listNavBarContents()

    if (!Array.isArray(navbarContent)) {
      throw new Error('Invalid navbar content format')
    }

    sendSuccessResponse(res, navbarContent)
  } catch (error) {
    console.error('Error fetching navbar content:', error)
    sendErrorResponse(res, 500, 'Internal server error')
  }
}

export const POST = async (
  req: MedusaRequest<MenuItem[]>,
  res: MedusaResponse<ApiResponse<{ message: string }>>
): Promise<void> => {
  try {
    const navbarService = req.scope.resolve<NavBarService>(NAVBAR_CONTENT_MODULE)
    const menuItems = req.body

    const validationError = validateMenuItems(menuItems)
    if (validationError) {
      sendErrorResponse(res, 400, validationError)
      return
    }

    const existingContent = await navbarService.listNavBarContents()
    const existingMenuItemIds = new Set(existingContent.map(item => item.id))
    
    const menuItemsToUpdate = menuItems.filter(item => existingMenuItemIds.has(item.id))
    const menuItemsToCreate = menuItems.filter(item => !existingMenuItemIds.has(item.id))

    const operations: Promise<unknown>[] = []

    if (menuItemsToUpdate.length) {
      const normalizedData = menuItemsToUpdate.map(({ id, title, link, placement }) => ({
        id,
        title: title.trim(),
        link: link.trim(),
        placement
      }))
      operations.push(navbarService.updateNavBarContents(normalizedData))
    }

    if (menuItemsToCreate.length) {
      const normalizedData = menuItemsToCreate.map(item => ({
        ...item,
        title: item.title.trim(),
        link: item.link.trim()
      }))
      operations.push(navbarService.createNavBarContents(normalizedData))
    }

    await Promise.all(operations)
    sendSuccessResponse(res, { message: 'Menu items updated successfully' })
  } catch (error) {
    console.error('Error updating navbar content:', error)
    sendErrorResponse(res, 500, 'Internal server error')
  }
}

export const DELETE = async (
  req: MedusaRequest<MenuItemDelete[]>,
  res: MedusaResponse<ApiResponse<{ message: string }>>
): Promise<void> => {
  try {
    const navbarService = req.scope.resolve<NavBarService>(NAVBAR_CONTENT_MODULE)
    const menuItemsToDelete = req.body

    if (!Array.isArray(menuItemsToDelete)) {
      sendErrorResponse(res, 400, 'Items to delete must be an array')
      return
    }

    if (menuItemsToDelete.length === 0) {
      sendErrorResponse(res, 400, 'Items to delete array cannot be empty')
      return
    }

    const invalidItems = menuItemsToDelete.filter(item => !item.id || typeof item.id !== 'string')
    if (invalidItems.length > 0) {
      sendErrorResponse(res, 400, 'All items must have a valid string id')
      return
    }

    await navbarService.deleteNavBarContents(menuItemsToDelete)
    sendSuccessResponse(res, { message: 'Menu items deleted successfully' })
  } catch (error) {
    console.error('Error deleting navbar content:', error)
    sendErrorResponse(res, 500, 'Internal server error')
  }
}