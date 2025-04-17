import { defineRouteConfig } from "@medusajs/admin-sdk"
import { House } from "@medusajs/icons"
import MainContent from "../../components/main-content"
import HomepageSlider from "../../components/homepage-slider"

const Homepage = () => {
  
  return (
    <div className="flex flex-col gap-y-10 w-full">
      <HomepageSlider />
      <MainContent />
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Homepage Editor",
  icon: House,
})

export default Homepage