import ContactUs from "@modules/contact-us"
import { cookies } from "next/headers"

export const metadata = {
  title: "Contact Us | Residential Railing & Metal Works LLC",
  description: "Contact our Customer Success team for more information and custom quotes",
  alternates: {
    canonical: `https://www.residentialrailingsandmetalworks.com/contact-us`
}
}

export default async function ContactPage() {
  const cookieStore = await cookies()
  const submission = cookieStore.get("_contact_us_form_submit") ? true : false
  return <ContactUs submission={submission} />
}
