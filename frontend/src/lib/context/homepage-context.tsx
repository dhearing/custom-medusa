'use client'

import { createContext, ReactNode } from "react"

interface HomepageData {
  content: string | null
  navbar: Array<{ id: string; title: string; link: string; placement: number }>
  slider: Array<{ id: string; src: string; placement: number; link: string; alt_text: string }>
}

export const HomepageContext = createContext<HomepageData | null>(null)

export function HomepageProvider({ 
  children, 
  data 
}: { 
  children: ReactNode
  data: HomepageData 
}) {
  return (
    <HomepageContext.Provider value={data}>
      {children}
    </HomepageContext.Provider>
  )
} 