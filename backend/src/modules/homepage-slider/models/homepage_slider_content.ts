import { model } from "@medusajs/framework/utils"

export const HomepageSliderContent = model.define("homepage_slider_content", {
  id: model.id().primaryKey(),
  src: model.text(),
  link: model.text(),
  alt_text: model.text(),
  placement: model.number()
})