import { Module } from "@medusajs/framework/utils"
import BlogResourceService from "./service"

export const BLOG_RESOURCE_CONTENT_MODULE = "blog_resource_content"

export default Module(BLOG_RESOURCE_CONTENT_MODULE, {
  service: BlogResourceService,
})