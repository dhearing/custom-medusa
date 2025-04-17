'use client'
import CategoryList from "../../components/refinement-list/resource-category-list"

const ResourceTemplate = ({
  content,
}: {
  content: any
}) => {

  return (
    <div className="bg-neutral-100">
      <h1 className="text-center text-xl sm:text-2xl font-semibold">Resources & Company Information</h1>
      <div className="flex flex-col py-6 content-container gap-4">
        <CategoryList content={content} />
      </div>
    </div>
  )
}

export default ResourceTemplate

