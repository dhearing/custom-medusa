import { Module } from "@medusajs/framework/utils"
import HomepageService from "./service"

export const HOMEPAGE_CONTENT_MODULE = "homepage_content"

export default Module(HOMEPAGE_CONTENT_MODULE, {
  service: HomepageService,
})