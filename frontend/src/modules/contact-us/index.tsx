"use client"
import ContactUsForm from "./form"
import { useState } from 'react'
import { SiGooglemaps } from "react-icons/si";
import { FaPhoneAlt, FaEnvelope, FaClock, FaCheckCircle } from "react-icons/fa"
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
    <div className="min-h-[calc(70vh-64px)] sm:mx-24 py-8">
      <div className="flex flex-row justify-around max-sm:flex-col">
        <div className="flex flex-col max-sm:w-full max-sm:px-5 gap-y-6">
          <h1 className="text-2xl py-6">Contact Us</h1>
          <p className="text-xl">
            For questions or for more information about our
            services.
          </p>
          {submission ? (
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 max-w-lg my-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-blue-50 p-3 rounded-full">
                  <FaCheckCircle size={48} className="text-[#007ae8]" />
                </div>
                <h3 className="text-xl font-semibold text-[#007ae8]">
                  Contact form submitted!
                </h3>
                <div className="w-16 h-1 bg-[#007ae8] rounded my-2"></div>
                <p className="text-gray-600 leading-relaxed">
                  Thanks for reaching out! Keep an eye on your inbox, our
                  customer service team will be in touch shortly!
                </p>
                <button 
                  onClick={() => router.push("/")}
                  className="mt-4 px-6 py-2 bg-[#007ae8] text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Return to Home
                </button>
              </div>
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