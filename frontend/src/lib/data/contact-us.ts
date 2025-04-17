"use server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { sdk } from "@lib/config"

export async function contactUsAction(
  currentState: unknown,
  formData: FormData
) {
  if (!formData) return "No form data received"
  const data = {
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  }
  const cookieStore = await cookies()
  const submit_cookie = cookieStore.get("_contact_us_form_submit")
  if (submit_cookie) {
    if (submit_cookie.value == JSON.stringify(data)) {
      redirect(`/contact-us?step=success`)
    }
    return "Only one contact request permitted per day"
  }
  if (!data.email || !data.subject || !data.message) {
    return "Please provide all of the required values before submitting"
  }
  try {
    await sdk.client.fetch("/contact-us", {
      method: "POST",
      body: data
    })
  } catch (error: any) {
    return error.toString()
  }
  const cookieStore2 = await cookies()
  cookieStore2.set("_contact_us_form_submit", JSON.stringify(data), {
    maxAge: 60 * 60 * 24,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
  redirect(`/contact-us?step=success`)
}

export const checkCookie = async () => {
  const cookieStore = await cookies()
  return cookieStore.get("_contact_us_form_submit")
}