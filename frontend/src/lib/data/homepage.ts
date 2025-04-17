import { sdk } from "@lib/config"

interface HomepageData {
  content: string | null
  navbar: Array<{
    id: string
    title: string
    link: string
    placement: number
  }>
  slider: Array<{
    id: string
    src: string
    placement: number
    link: string
    alt_text: string
  }>
}

export const getHomepageData = async (): Promise<HomepageData> => {
  const data = await sdk.client.fetch<HomepageData>("/store/homepage")
  return data
}