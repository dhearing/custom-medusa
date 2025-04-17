import { MedusaService } from "@medusajs/framework/utils"
import { BlogResourceContent } from "./models/blog_resource_content"

class HomepageService extends MedusaService ({
  BlogResourceContent,
}) {
  
}

export default HomepageService