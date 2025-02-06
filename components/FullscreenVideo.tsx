"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface FullscreenVideoProps {
  src: string
  // onEnded: () => void
}

const FullscreenVideo: React.FC<FullscreenVideoProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play()
      // if (video.requestFullscreen) {
      //   video.requestFullscreen()
      // }
    }
  }, [])

  return (
    <video
      ref={videoRef}
      src={src}
      // onEnded={onEnded}
      className="fixed inset-0 w-full h-full object-contain z-50"
      playsInline
    />
  )
}

export default FullscreenVideo

