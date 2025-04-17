import { model } from "@medusajs/framework/utils"

export const NavBarContent = model.define("navbar_content", {
  id: model.id().primaryKey(),
  title: model.text(),
  link: model.text(),
  placement: model.number()
})