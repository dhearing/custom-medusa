import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HOMEPAGE_CONTENT_MODULE } from "src/modules/homepage"
import HomepageService from '../../../modules/homepage/service'
import { ContentBody, HomepageContent, ApiResponse } from '../../../types'

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const homepageService = req.scope.resolve<HomepageService>(HOMEPAGE_CONTENT_MODULE)
    const [homepageContent] = await homepageService.listHomepageContents()

    if (!homepageContent) {
      res.status(404).json({
        status: 'error',
        error: 'Homepage content not found'
      } as ApiResponse)
      return
    }

    res.status(200).json({
      status: 'success',
      data: { content: homepageContent.content }
    } as ApiResponse<HomepageContent>)
  } catch (error) {
    console.error('Error fetching homepage content:', error)
    res.status(500).json({
      status: 'error',
      error: 'Internal server error'
    } as ApiResponse)
  }
}

export const POST = async (
  req: MedusaRequest<ContentBody>,
  res: MedusaResponse
): Promise<void> => {
  try {
    const homepageService = req.scope.resolve<HomepageService>(HOMEPAGE_CONTENT_MODULE)
    const { content } = req.body

    if (!content) {
      res.status(400).json({
        status: 'error',
        error: 'Content is required'
      } as ApiResponse)
      return
    }

    const existingContent = await homepageService.listHomepageContents()
    
    if (!existingContent.length) {
      await homepageService.createHomepageContents({ content })
    } else {
      const [firstContent] = existingContent
      await homepageService.updateHomepageContents([{
        id: firstContent.id,
        content
      }])
    }

    res.status(200).json({
      status: 'success',
      data: { content }
    } as ApiResponse<HomepageContent>)
  } catch (error) {
    console.error('Error updating homepage content:', error)
    res.status(500).json({
      status: 'error',
      error: 'Internal server error'
    } as ApiResponse)
  }
}