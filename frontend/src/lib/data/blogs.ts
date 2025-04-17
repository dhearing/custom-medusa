import { sdk } from "@lib/config"

interface BlogData {
  id: string,
  title: string,
  description: string,
  content: string,
  main_image: string,
  link: string,
  status: boolean,
  author: string,
  views: number,
  category: string,
}

export const getBlogData = async (): Promise<BlogData> => {
  const data = await sdk.client.fetch<BlogData>("/store/blogs")
  return data
}