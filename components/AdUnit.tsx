'use client'

import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdUnitProps {
  client: string
  slot: string
  format?: string
  responsive?: boolean
  style?: React.CSSProperties
}

export default function AdUnit({ 
  client, 
  slot, 
  format = 'auto', 
  responsive = true, 
  style = {} 
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const adPushed = useRef(false)

  useEffect(() => {
    if (adRef.current && !adPushed.current) {
      const pushAd = () => {
        try {
          if (!adPushed.current) {
            (window.adsbygoogle = window.adsbygoogle || []).push({})
            adPushed.current = true
          }
        } catch (err) {
          console.error('AdSense error:', err)
        }
      }

      if (adRef.current.offsetWidth > 0) {
        pushAd()
      } else {
        const resizeObserver = new ResizeObserver((entries) => {
          if (entries[0].contentRect.width > 0) {
            pushAd()
            resizeObserver.disconnect()
          }
        })
        resizeObserver.observe(adRef.current)
        return () => resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <div ref={adRef} className="ad-container flex justify-center items-center w-full my-4">
      <div className="relative max-w-full w-full">
        <p className="text-xs text-gray-500 text-center mb-1">- Advertisement -</p>
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            minWidth: '250px',
            minHeight: '100px',
            width: '100%',
            ...style 
          }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </div>
  )
}