import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CONTACT_US_MODULE } from "src/modules/contact-us";
import ContactUsService from "src/modules/contact-us/service";

interface ContactUsRequest {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const contactUsService = req.scope.resolve<ContactUsService>(CONTACT_US_MODULE)
  const { name, email, phone, subject, message } = req.body as ContactUsRequest
  
  try {
    const contactUsContent = await contactUsService.createContactUsContents({
      name,
      email,
      phone,
      subject,
      message
    })
    
    return res.json({
      status: "success",
      data: contactUsContent,
      message: "Your message has been sent successfully!"
    })
  } catch (error) {
    res.status(500)
    return res.json({
      status: "error",
      message: "Failed to send message. Please try again."
    })
  }
}