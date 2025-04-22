import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Envelope } from "@medusajs/icons"
import ContactUsPage from "../../components/contact-us"

const ContactUs = () => {
  
  return (
    <div className="flex flex-col gap-y-10 w-full">
      <ContactUsPage />
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Contact Us",
  icon: Envelope,
})

export default ContactUs