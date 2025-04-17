import { Container } from "@medusajs/ui"
import Radio from "@modules/common/components/radio"
import { useState } from "react"
import Resources from "@modules/resources"

type RefinementListProps = {
  content?: any
}

const CategoryList = ({
  content = []
}: RefinementListProps) => {

  const [selectedCategory, setSelectedCategory] = useState<string | null>("all")

  const safeResourceContent = Array.isArray(content) ? content : [];

  const allContentData = safeResourceContent.map((category: any) => category)

  const [categoryData, setCategoryData] = useState<any[]>([])

  const toggleCategory = (categoryTitle: string) => {
    setSelectedCategory((prevCategory) => 
      prevCategory === categoryTitle ? null : categoryTitle
    )
    
    if (categoryTitle === "all") {
      setCategoryData([])
    } else {
      getCategoryData(categoryTitle)
    }
  }

  const getCategoryData = (category: string) => {
    if (!Array.isArray(content)) {
      setCategoryData([]);
      return;
    }
    
    const data = content.filter((data: any) => 
      data.category ? data.category === category : data.name === category
    );
    setCategoryData(data);
  }

  const isCurrentCategory = (title: string) => {
    return selectedCategory === title
  }

  const renderCategory = (content: any) => {
    return (
      <li key={content.id}>
        <div className={`flex items-center gap-2 mb-2 pl-3`}>
          <div 
            onClick={() => toggleCategory(content.category)} 
            className="flex gap-2 items-center hover:text-neutral-700 cursor-pointer"
          >
            <Radio checked={isCurrentCategory(content.category)} />
            {content.category}
          </div>
        </div>
      </li>
    )
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row small:items-start gap-3">
        <div className="sm:flex flex-col w-1/5 gap-3 relative hidden">
          <Container className="sm:flex flex-col p-0 sticky top-32 max-h-[65vh] overflow-y-scroll hidden">
            <div className="flex justify-between items-center p-3">
              <div className="text-sm font-medium">Categories</div>
            </div>
            <ul className="flex flex-col gap-3 text-sm p-3 text-neutral-500">
                <li key="all-category">
                  <div className="flex items-center gap-2 mb-4 pl-3">
                    <div
                      onClick={() => toggleCategory("all")}
                      className="flex gap-2 items-center hover:text-neutral-700 cursor-pointer"
                    >
                      <Radio checked={isCurrentCategory("all")} />
                      <span className="font-medium">All Content</span>
                    </div>
                  </div>
                </li>
                
                <li className="border-b border-gray-200 mb-2"></li>
                
                {safeResourceContent
                .filter((content: any) => content.category)
                .sort((a: any, b: any) => a?.category?.localeCompare(b.category))
                .map(renderCategory)}
            </ul>
          </Container>
        </div>
        <div className="w-full">
          <Resources content={selectedCategory === "all" ? allContentData : (selectedCategory ? categoryData : allContentData)}/>
        </div>
      </div>
    </div>
  )
}

export default CategoryList