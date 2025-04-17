import { model } from "@medusajs/framework/utils"

export const BlogResourceContent = model.define("blog_resource_content", {
  id: model.id().primaryKey(),
  title: model.text(),
  description: model.text(),
  content: model.text(),
  main_image: model.text(),
  link: model.text(),
  status: model.boolean(),
  author: model.text(),
  views: model.number(),
  category: model.text(),
})