"use client"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useActionState } from "react"
import { contactUsAction } from "@lib/data/contact-us"
import { useState } from "react"

type FormValues = {
  name: string
  email: string
  phone: string
  message: string
}
const ContactUsForm = () => {
  const [formData, setFormData] = useState<FormValues>({
    name: "",
    email: "",
    phone: "",
    message: ""
  })
  const [message, formAction] = useActionState(contactUsAction, null)
  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLInputElement
      | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <>
      <form action={formAction} className="flex flex-col pb-5">
        <input
          className="input input-xl input-block rounded border border-grey-2 border-l-[3px] mb-6"
          type="text"
          name="name"
          id="name"
          placeholder="Name *"
          onChange={handleChange}
          value={formData?.name ?? ""}
          required
          data-testid="contact-us-name"
          min={3}
        />
        <input
          className="input input-xl input-block rounded border border-grey-2 border-l-[3px] mb-6"
          type="email"
          placeholder="Email Address *"
          title="Enter a valid email address."
          name="email"
          onChange={handleChange}
          value={formData?.email ?? ""}
          required
          data-testid="contact-us-email"
          minLength={3}
        />
        <input
          className="input input-xl input-block rounded border border-grey-2 border-l-[3px] mb-6"
          type="tel"
          placeholder="Phone Number *"
          name="phone"
          onChange={handleChange}
          value={formData?.phone ?? ""}
        />
        <textarea
          rows={4}
          placeholder="Message *"
          name="message"
          onChange={handleChange}
          value={formData?.message ?? ""}
          required
          data-testid="contact-us-message"
          className="textarea textarea-block rounded border border-grey-2 border-l-hover border-l-[3px] mb-6"
        />
        <div className="flex justify-end">
          <SubmitButton
            className="btn btn-rounded text-lg bg-hover hover:bg-grey-3 text-white w-40 mt-4 max-sm:w-full"
            data-testid="submit-contact-us-button"
          >
            Submit
          </SubmitButton>
        </div>
        {message && (
          <ErrorMessage error={message} data-testid="address-error-message" />
        )}
      </form>
    </>
  )
}

export default ContactUsForm
