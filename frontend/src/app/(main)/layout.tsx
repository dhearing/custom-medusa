import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"
import Layout from "@modules/layout/templates"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {

  return (
    <Layout>{props.children}</Layout>
  )
}
