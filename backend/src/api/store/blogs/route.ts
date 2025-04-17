import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { BLOG_RESOURCE_CONTENT_MODULE } from "src/modules/blogs-resources"
import BlogResourceService from '../../../modules/blogs-resources/service'

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const blogResourceModuleService = req.scope.resolve<BlogResourceService>(BLOG_RESOURCE_CONTENT_MODULE)

  const [blogResourceContent] = await Promise.all([
    blogResourceModuleService.listBlogResourceContents()
  ])

  res.status(200).json({
    content: blogResourceContent || []
  });
}
