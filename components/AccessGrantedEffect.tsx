"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Maximize2, X, Minus, Binary } from "lucide-react"
import Image from "next/image"

interface PopupImage {
  id: number
  x: number
  y: number
  width: number
  height: number
  delay: number
  imageUrl: string
  title: string
  aspectRatio: number
}

interface AccessGrantedEffectProps {
  images: Array<{
    url: string
    width: number
    height: number
  }>
}

const generateRandomPosition = (
  usedPositions: { x: number; y: number }[],
  imageData: { url: string; width: number; height: number },
  index: number,
): PopupImage => {
  let x: number, y: number
  let attempts = 0
  const minDistance = 20

  const centerX = 50
  const centerY = 50
  const avoidWidth = 30
  const avoidHeight = 25

  do {
    x = Math.random() * 80
    y = Math.random() * 80

    const distanceFromCenterX = Math.abs(x - centerX)
    const distanceFromCenterY = Math.abs(y - centerY)

    if (distanceFromCenterX < avoidWidth && distanceFromCenterY < avoidHeight) {
      attempts++
      continue
    }

    const isTooClose = usedPositions.some((pos) => {
      const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2))
      return distance < minDistance
    })

    if (!isTooClose) break

    attempts++
  } while (attempts < 100)

  const distanceFromCenter = Math.sqrt(Math.pow(x - 50, 2) + Math.pow(y - 50, 2))
  // 中央からの距離に応じて基準幅を調整 (200px ~ 300px)
  const baseWidth = 250 - Math.min(50, distanceFromCenter)
  const aspectRatio = imageData.width / imageData.height
  const width = baseWidth
  const height = baseWidth / aspectRatio

  return {
    id: Math.random(),
    x,
    y,
    width,
    height,
    delay: Math.random() * 0.5,
    imageUrl: imageData.url,
    title: `ENCRYPTED_DATA_${(index + 1).toString().padStart(3, "0")}.dat`,
    aspectRatio,
  }
}

export default function AccessGrantedEffect({ images }: AccessGrantedEffectProps) {
  const [displayedImages, setDisplayedImages] = useState<PopupImage[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [usedImageIndices, setUsedImageIndices] = useState<number[]>([])

  useEffect(() => {
    if (isComplete || images.length === 0) return

    const getNextImage = () => {
      const availableIndices = Array.from({ length: images.length }, (_, i) => i).filter(
        (i) => !usedImageIndices.includes(i),
      )

      if (availableIndices.length === 0) return null

      const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
      setUsedImageIndices((prev) => [...prev, randomIndex])
      return { data: images[randomIndex], index: randomIndex }
    }

    const interval = 200
    const timer = setInterval(() => {
      const nextImage = getNextImage()

      if (!nextImage) {
        clearInterval(timer)
        setIsComplete(true)
        return
      }

      setDisplayedImages((prev) => {
        const newImage = generateRandomPosition(prev, nextImage.data, nextImage.index)
        return [...prev, newImage]
      })
    }, interval)

    return () => clearInterval(timer)
  }, [isComplete, images, usedImageIndices])

  return (
    <div className="fixed inset-0 z-[55] pointer-events-none">
      <AnimatePresence>
        {displayedImages.map((image) => (
          <motion.div
            key={image.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: image.delay,
            }}
            style={{
              position: "absolute",
              left: `${image.x}%`,
              top: `${image.y}%`,
              width: `${image.width}px`,
            }}
            className="bg-black rounded-lg overflow-hidden border border-green-500 shadow-lg shadow-green-500/20"
          >
            {/* Window Title Bar */}
            <div className="bg-green-950 px-3 py-2 flex items-center justify-between border-b border-green-500">
              <div className="flex items-center space-x-2">
                <Binary className="w-4 h-4 text-green-400" />
                <span className="text-xs text-green-400 font-mono">{image.title}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-green-400 hover:text-green-300">
                  <Minus className="w-3 h-3" />
                </button>
                <button className="text-green-400 hover:text-green-300">
                  <Maximize2 className="w-3 h-3" />
                </button>
                <button className="text-green-400 hover:text-green-300">
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div
              className="relative"
              style={{
                height: `${image.height}px`,
                aspectRatio: image.aspectRatio,
              }}
            >
              <Image
                src={image.imageUrl || "/placeholder.svg"}
                alt=""
                width={image.width}
                height={image.height}
                className="object-contain"
                priority={usedImageIndices.indexOf(displayedImages.indexOf(image)) < 3}
                loading="eager"
                quality={85}
                sizes={`${image.width}px`}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
              {/* Status Bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-green-950/90 px-2 py-1 text-[10px] text-green-400 font-mono border-t border-green-500">
                <div className="flex justify-between items-center">
                  <span>SIZE: {Math.floor(Math.random() * 1000)}KB</span>
                  <span>TYPE: ENCRYPTED</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

