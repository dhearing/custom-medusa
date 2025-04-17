'use client'
import { Github } from "@medusajs/icons"
import { Heading } from "@medusajs/ui"
import { useContext } from "react"
import { HomepageContext } from "@lib/context/homepage-context"
import RichTextContent from "../../common/components/rich-text/rich-text-content"

const MainContent = () => {
  const homepageData = useContext(HomepageContext)
  const content = homepageData?.content ?? null
  
  // Function to check if HTML content has actual text content
  const hasActualContent = (htmlString: string) => {
    // If it's an empty paragraph or just has spaces, consider it empty
    if (htmlString.trim() === '<p class="editor-paragraph"></p>' || 
        htmlString.includes('<p class="editor-paragraph">') && 
        !htmlString.replace(/<p class="editor-paragraph">|<\/p>/g, '').trim()) {
      return false;
    }
    
    // Remove all HTML tags and check if there's any text content left
    const textContent = htmlString.replace(/<[^>]*>/g, '').trim();
    return textContent.length > 0;
  };

  // More robust check for content - handles empty strings, null, undefined, and empty HTML
  const hasValidContent = content && 
                          typeof content === 'string' && 
                          hasActualContent(content);
  
  console.log("Content:", content);
  console.log("Has valid content:", hasValidContent);
  
  return (
    <div className="w-full border-ui-border-base relative p-8 small:p-0">
      {hasValidContent ? (
        <div className="w-full">
          <RichTextContent content={content} />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-center small:p-32 gap-6">
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
          <span>
            <p>Please insert content in the Homepage Editor section of the Backend</p>
          </span>
        </div>
      )}
    </div>
  )
}

export default MainContent
