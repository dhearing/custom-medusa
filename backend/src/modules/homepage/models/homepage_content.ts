import { model } from "@medusajs/framework/utils"

export const HomepageContent = model.define("homepage_content", {
  id: model.id().primaryKey(),
  content: model.text()
})