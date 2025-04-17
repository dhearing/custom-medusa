"use client"
import ContactUsForm from "./form"
import { useState } from 'react'
import { SiGooglemaps } from "react-icons/si";
import {  FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa"
import Link from "next/link"
import Modal from "@modules/common/components/modal"
import Success from "@modules/common/components/success"
import { useSearchParams, useRouter } from "next/navigation"

const ContactUs = ({ submission }: { submission: boolean }) => {
  const [isOpen, setIsOpen] = useState(true)
  const searchParams = useSearchParams()
  const successParams = searchParams.get("step") === "success"
  const router = useRouter()
  const onClose = () => {
    setIsOpen(false)
    router.push("/contact-us")
  }

  return (
    <div className="sm:mx-24 py-8">
      <div className="flex flex-row justify-around max-sm:flex-col">
        <div className="flex flex-col max-sm:w-full max-sm:px-5 gap-y-6">
          <h1 className="text-2xl py-6">Contact Us</h1>
          <p className="text-xl">
            For questions about a quote or for more information about our
            services.
          </p>
          {submission ? (
            <div className="text-center">
              <h3 className="text-hover text-center text-xl">
                Contact form submitted!
              </h3>
              <span>
                Thanks for reaching out! Keep an eye on your inbox, our
                customer service team will be in touch shortly!
              </span>
            </div>
          ) : (
            <ContactUsForm />
          )}
          {successParams && (
            <Modal isOpen={isOpen} close={onClose} size="large">
              <Success
                title={"Contact request sent successfully!"}
                details={
                  "Your contact request has been successfully sent to our customer service team. We aim to respond to all requests within one business day."
                }
              />
            </Modal>
          )}
        </div>
        <div className="flex flex-col gap-y-5 justify-center w-45 font-bold max-sm:w-full max-sm:px-5">
          <div className="flex flex-row items-center">
            <SiGooglemaps size={40} color='#007ae8' className="mr-3"/>
            <div>
              ADDRESS HERE
            </div>
          </div>
          <div className="flex flex-row items-center">
            <FaClock size={40} color='#007ae8' className="mr-3"/>
            <div>OPERATING HOURS HERE</div>
          </div>
          <div className="flex gap-x-10 mb-6 gap-y-5 flex-col max-sm:items-center">
            <Link href='tel:/' className="flex flex-row items-center">
              <FaPhoneAlt size={40} color='#007ae8' className="mr-3"/>
              <div>PHONE # HERE</div>
            </Link>
            <Link href='mailto:/' className="flex flex-row items-center">
              <FaEnvelope size={40} color='#007ae8' className="mr-3"/>
              <div>SUPPORT EMAIL HERE</div>  
            </Link>
            
          </div>
        </div>
      </div> 
    </div>
  )
}

export default ContactUs