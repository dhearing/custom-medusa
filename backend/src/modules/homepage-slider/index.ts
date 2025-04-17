import { Module } from "@medusajs/framework/utils"
import HomepageSliderContentService from "./service"

export const HOMEPAGE_SLIDER_CONTENT_MODULE = "homepage_slider_content"

export default Module(HOMEPAGE_SLIDER_CONTENT_MODULE, {
  service: HomepageSliderContentService,
})
