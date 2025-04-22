import { MedusaService } from "@medusajs/framework/utils"
import { ContactUsContent } from "./models/contact-us-content"

class ContactUsService extends MedusaService ({
  ContactUsContent,
}) {
  
}

export default ContactUsService