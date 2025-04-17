import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HOMEPAGE_SLIDER_CONTENT_MODULE } from "src/modules/homepage-slider"
import HomepageSliderContentService from '../../../modules/homepage-slider/service'
import { 
  SliderImage, 
  DeleteItem,
  ApiResponse 
} from '../../../admin/components/homepage-slider/types'

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

const validateSliderImages = (items: SliderImage[]): string | null => {
  if (!Array.isArray(items)) {
    return 'Slider images must be an array'
  }

  // Allow empty arrays - having no slider images is valid
  if (items.length > 0) {
    const invalidItems = items.filter(item => 
      !item.src?.trim() || 
      !item.alt_text?.trim() || 
      !item.link?.trim()
    )

    if (invalidItems.length > 0) {
      return 'Invalid slider images found. Each item must have a non-empty src, alt_text, and link'
    }
  }

  return null
}

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse<ApiResponse<SliderImage[]>>
): Promise<void> => {
  try {
    const sliderService = req.scope.resolve<HomepageSliderContentService>(HOMEPAGE_SLIDER_CONTENT_MODULE)
    const sliderContent = await sliderService.listHomepageSliderContents()

    if (!Array.isArray(sliderContent)) {
      throw new Error('Invalid slider content format')
    }

    sendSuccessResponse(res, sliderContent)
  } catch (error) {
    console.error('Error fetching slider content:', error)
    sendErrorResponse(res, 500, 'Internal server error')
  }
}

export const POST = async (
  req: MedusaRequest<SliderImage[]>,
  res: MedusaResponse<ApiResponse<{ message: string }>>
): Promise<void> => {
  try {
    const sliderService = req.scope.resolve<HomepageSliderContentService>(HOMEPAGE_SLIDER_CONTENT_MODULE)
    const sliderImages = req.body

    const validationError = validateSliderImages(sliderImages)
    if (validationError) {
      sendErrorResponse(res, 400, validationError)
      return
    }

    const existingContent = await sliderService.listHomepageSliderContents()
    const existingImageIds = new Set(existingContent.map(item => item.id))
    
    const imagesToUpdate = sliderImages.filter(item => existingImageIds.has(item.id))
    const imagesToCreate = sliderImages.filter(item => !existingImageIds.has(item.id))

    const operations: Promise<unknown>[] = []

    if (imagesToUpdate.length) {
      const normalizedData = imagesToUpdate.map(({ id, src, alt_text, link, placement }) => ({
        id,
        src: src.trim(),
        alt_text: alt_text.trim(),
        link: link?.trim() || '',
        placement: Number(placement || 0)
      }))
      operations.push(sliderService.updateHomepageSliderContents(normalizedData))
    }

    if (imagesToCreate.length) {
      const normalizedData = imagesToCreate.map(item => ({
        ...item,
        src: item.src.trim(),
        alt_text: item.alt_text.trim(),
        link: item.link?.trim() || '',
        placement: Number(item.placement || 0)
      }))
      operations.push(sliderService.createHomepageSliderContents(normalizedData))
    }

    await Promise.all(operations)
    sendSuccessResponse(res, { message: 'Slider images updated successfully' })
  } catch (error) {
    console.error('Error updating slider content:', error)
    sendErrorResponse(res, 500, 'Internal server error')
  }
}

export const DELETE = async (
  req: MedusaRequest<DeleteItem[]>,
  res: MedusaResponse<ApiResponse<{ message: string }>>
): Promise<void> => {
  try {
    const sliderService = req.scope.resolve<HomepageSliderContentService>(HOMEPAGE_SLIDER_CONTENT_MODULE)
    const imagesToDelete = req.body

    if (!Array.isArray(imagesToDelete)) {
      sendErrorResponse(res, 400, 'Items to delete must be an array')
      return
    }

    if (imagesToDelete.length === 0) {
      sendErrorResponse(res, 400, 'Items to delete array cannot be empty')
      return
    }

    const invalidItems = imagesToDelete.filter(item => !item.id || typeof item.id !== 'string')
    if (invalidItems.length > 0) {
      sendErrorResponse(res, 400, 'All items must have a valid string id')
      return
    }

    await sliderService.deleteHomepageSliderContents(imagesToDelete)
    sendSuccessResponse(res, { message: 'Slider images deleted successfully' })
  } catch (error) {
    console.error('Error deleting slider content:', error)
    sendErrorResponse(res, 500, 'Internal server error')
  }
}

