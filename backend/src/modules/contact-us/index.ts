import { Module } from "@medusajs/framework/utils"
import ContactUsService from "./service"

export const CONTACT_US_MODULE = "contact_us"

export default Module(CONTACT_US_MODULE, {
  service: ContactUsService,
})