'use client'
import { Github } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import { useContext } from "react"
import { HomepageContext } from "@lib/context/homepage-context"
import RichTextContent from "../../common/components/rich-text/rich-text-content"

const MainContent = () => {
  const homepageData = useContext(HomepageContext)
  const content = homepageData?.content ?? null

  return (
    <div className="w-full border-b border-ui-border-base relative p-8 small:p-0">
      {content ? (
        <div className="w-full">
          <RichTextContent content={content} />
        </div>
      ) : (
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
          <span>
            <Heading
              level="h1"
              className="text-3xl leading-10 text-ui-fg-base font-normal"
            >
              Ecommerce Starter Template
            </Heading>
            <Heading
              level="h2"
              className="text-3xl leading-10 text-ui-fg-subtle font-normal"
            >
              Powered by Medusa and Next.js
            </Heading>
          </span>
          <a
            href="https://github.com/medusajs/nextjs-starter-medusa"
            target="_blank"
            rel="noreferrer"
          >
            <button className="px-4 py-2 border rounded-md bg-transparent hover:bg-gray-50 transition-colors duration-200 flex items-center gap-x-2">
              View on GitHub
              <Github />
            </button>
          </a>
        </div>
      )}
    </div>
  )
}

export default MainContent
