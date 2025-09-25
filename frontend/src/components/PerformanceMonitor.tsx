'use client'

import { useEffect } from 'react'

interface PerformanceMonitorProps {
  isDevelopment?: boolean
}

export default function PerformanceMonitor({ isDevelopment = false }: PerformanceMonitorProps) {
  useEffect(() => {
    if (!isDevelopment && process.env.NODE_ENV !== 'development') return

    // Monitor Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime)
        }
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as any // Type assertion for FID
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
        }
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          console.log('CLS:', (entry as any).value)
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (e) {
      // Fallback for older browsers
      console.log('Performance Observer not supported')
    }

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) {
          console.warn('Slow resource:', entry.name, entry.duration + 'ms')
        }
      })
    })

    try {
      resourceObserver.observe({ entryTypes: ['resource'] })
    } catch (e) {
      console.log('Resource Observer not supported')
    }

    return () => {
      observer.disconnect()
      resourceObserver.disconnect()
    }
  }, [isDevelopment])

  return null
}