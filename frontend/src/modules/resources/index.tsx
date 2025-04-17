"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Container } from "@medusajs/ui"

// Helper function to convert Google Drive sharing URL to a direct image URL
const getImageUrl = (url: string) => {
  if (!url) return "/placeholder-image.jpg" // Provide a placeholder image path

  // Check if it's a Google Drive URL
  if (url.includes("drive.google.com/file/d/")) {
    try {
      // Extract the file ID from the Google Drive URL
      const fileIdMatch = url.match(/\/d\/([^\/]+)/)
      if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1]
        // Return the direct download URL
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    } catch (error) {
      console.error("Error parsing Google Drive URL:", error)
    }
  }
  
  // Return the original URL if it's not a Google Drive URL or if extraction fails
  return url
}

const Resources = ({ content }: { content: any[] }) => {
  const [slice, setSlice] = useState([0, 8])
  const [showLoadMore, setShowLoadMore] = useState(true)

  const loadMore = () => {
    setSlice([0, slice[1] + 8])
    if (content.length < slice[1] + 8) {
      setShowLoadMore(false)
    }
  }

  return (
    <div>
      <ul className="grid grid-cols-1 w-full sm:grid-cols-4 medium:grid-cols-4 gap-4">
        {content ? (
          content.slice(slice[0], slice[1]).map((post, index) => {
            // Convert the image URL to a format that Next.js can use
            const imageUrl = getImageUrl(post?.main_image)

            return (
              <li
                key={index}
                className="flex flex-col bg-grey-8 border-4 border-grey-8 rounded-1 hover:shadow-base"
              >
                <Link
                  className="flex flex-col h-full"
                  href={`/content/${post?.link}`}
                >
                  <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col">
                      <Container className="relative aspect-square shadow-none bg-white">
                        <Image
                          src={imageUrl}
                          className="absolute p-4"
                          alt={post?.title || "Resource image"}
                          fill
                          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                          style={{
                            objectFit: "scale-down",
                          }}
                        />
                      </Container>
                      <div className="flex flex-col items-center justify-center text-center m-2 max-sm:mx-3 gap-y-3 pb-3">
                        <div className="flex items-center text-base font-semibold sm:text-lg">
                          {post?.title || "Untitled"}
                        </div>
                        <div className="flex text-sm">
                          {post?.description || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })
        ) : (
          <div className="flex justify-center items-center w-full h-96"></div>
        )}
      </ul>
      {showLoadMore && content && content.length > slice[1] && (
        <div className="w-full flex justify-center">
          <button
            className="btn btn-md btn-rounded bg-hover hover:bg-grey-3 text-white my-5 w-30 max-sm:w-full"
            onClick={() => loadMore()}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}
export default Resources
