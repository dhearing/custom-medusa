import { Module } from "@medusajs/framework/utils"
import HomepageService from "./service"

export const NAVBAR_CONTENT_MODULE = "navbar_content"

export default Module(NAVBAR_CONTENT_MODULE, {
  service: HomepageService,
})