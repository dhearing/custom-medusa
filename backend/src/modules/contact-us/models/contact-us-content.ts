import { model } from "@medusajs/framework/utils"

export const ContactUsContent = model.define("contact_us_content", {
  id: model.id().primaryKey(),
  name: model.text(),
  email: model.text(),
  phone: model.text(),
  subject: model.text(),
  message: model.text(),
})
