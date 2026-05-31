'use client'

import { motion } from 'framer-motion'
import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {/* Premium Top Progress Bar Effect built with Framer */}
      <motion.div
        key={`loader-${pathname}`}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ 
           scaleX: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
           opacity: { duration: 0.4, delay: 0.4, ease: "linear" }
        }}
        className="fixed top-0 left-0 right-0 h-1 bg-linear-to-r from-brand-primary via-purple-500 to-brand-secondary z-50 origin-left"
      />
      
      {/* Main Content Soft-Blur Premium Entrance */}
      <motion.main
        key={`content-${pathname}`}
        initial={{ opacity: 0, y: 24, filter: 'blur(12px)', scale: 0.98 }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.16, 1, 0.3, 1] // iOS-like springy curve without bounce
        }}
        className="w-full h-full origin-top"
      >
        {children}
      </motion.main>
    </>
  )
}
