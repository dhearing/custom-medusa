import { Metadata } from "next"
import ResourceTemplate from "@modules/store/templates/resources"
import { getBlogData } from "@lib/data/blogs"
export const metadata: Metadata = {
  title: "Blogs & Resources | Store Name",
  description:
    "Blogs & Resources | Store Name",
}

export default async function Content() {
  const blogResourceContent = await getBlogData()
  const content = blogResourceContent.content
  
  return (
    <ResourceTemplate content={content} />
  )
}