import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CONTACT_US_MODULE } from "src/modules/contact-us";
import ContactUsService from "src/modules/contact-us/service";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const contactUsService = req.scope.resolve<ContactUsService>(CONTACT_US_MODULE)
  const contactUsContent = await contactUsService.listContactUsContents()

  return res.json({data: contactUsContent})
}