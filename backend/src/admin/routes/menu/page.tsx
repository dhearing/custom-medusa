import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Link } from "@medusajs/icons"
import NavBar from "../../components/navbar"

const Homepage = () => {
  
  return (
    <NavBar />
  )
}

export const config = defineRouteConfig({
  label: "Navigation Menu Editor",
  icon: Link,
})

export default Homepage