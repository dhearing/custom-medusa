import { Metadata } from "next"
// import FeaturedProducts from "@modules/home/featured-products"
import MainContent from "@modules/home/main-content"
// import { listCollections } from "@lib/data/collections"
// import { getRegion } from "@lib/data/regions"
import Slider from "@modules/home/slider"

export const metadata: Metadata = {
  title: "Store Name",
  description:
    "A performant frontend ecommerce starter template with Next.js 14 and Medusa.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {

  // const params = { countryCode: 'us' }

  // const { countryCode } = params

  // const region = await getRegion(countryCode)

  // const { collections } = await listCollections({
  //   fields: "id, handle, title",
  // })


  // if (!collections || !region) {
  //   return null
  // }

  return (
    <div className="sm:mx-24">
      <Slider />
      <MainContent />
      {/* {collections.length > 0 && (
        <div className="py-12">
          <ul className="flex flex-col gap-x-6">
            <FeaturedProducts collections={collections} region={region} />
          </ul>
        </div>
      )} */}
    </div>
  )
}
