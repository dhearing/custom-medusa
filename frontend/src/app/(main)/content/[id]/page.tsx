import { draftMode } from "next/headers"
import ResourceSlug from "@modules/resources/ResourceSlug"
import { notFound } from "next/navigation"
import { getBlogData } from "@lib/data/blogs"
import Link from "next/link"

type Props = {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props) {
  // Destructure the id parameter first
  const { id } = params
  
  try {
    const link_rewrite = id.substring(id.indexOf("-") + 1)
    const { isEnabled } = await draftMode()
    if (!isEnabled) {
      const resource = await getBlogData()
      // Check if content exists and is an array before filtering
      const blogItems = Array.isArray(resource?.content) ? resource.content : []
      const content = blogItems.find((item: any) => item.link === link_rewrite)
      
      if (!content) return { title: 'Content Not Found' }
      
      return {
        title: `${content.title || 'Blog Post'} | Medusa Store`,
        description: content.description,
        openGraph: {
          title: `${content.title || 'Blog Post'} | Medusa Store`,
          description: content.description,
        },
        alternates: {
          canonical: `/content/${id}`,
        },
      }
    }
  } catch (error) {
    notFound()
  }
  
  return { title: 'Blog Post' }
}

export default async function Post({ params }: Props) {
  // Destructure the id parameter first
  const { id } = params
  
  try {
    const link_rewrite = id.substring(id.indexOf("-") + 1)
    const resource = await getBlogData()
    const blogItems = Array.isArray(resource?.content) ? resource.content : []
    const content = blogItems.find((item: any) => item.link === link_rewrite)
    
    if (!content) {
      return notFound()
    }
    
    return (
      <div className="content-container px-4">
        <div className="flex items-center gap-1 py-6 text-ui-fg-subtle">
          <Link href="/content">Resources</Link>
          <span> | </span>
          <span>{content.title}</span>
        </div>
        <div className="sm:px-10 min-h-[50vh]">
          <ResourceSlug content={content.content} />
        </div>
      </div>
    )
  } catch (error) {
    return notFound()
  }
}
