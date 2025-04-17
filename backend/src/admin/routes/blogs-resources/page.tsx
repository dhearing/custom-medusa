import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Book } from "@medusajs/icons"
import BlogsResources from "../../components/blogs-resources"

const Blogs = () => {
  return (
    <BlogsResources />
  )
}

export const config = defineRouteConfig({
  label: "Blogs & Resources",
  icon: Book,
})


export default Blogs