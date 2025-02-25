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
}

interface AccessGrantedEffectProps {
  images: string[]
}

const generateRandomPosition = (
  usedPositions: { x: number; y: number }[],
  imageUrl: string,
  index: number,
): PopupImage => {
  let x: number, y: number
  let attempts = 0
  const minDistance = 30

  const centerX = 50
  const centerY = 50
  const avoidWidth = 30
  const avoidHeight = 35

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
  const sizeMultiplier = 1 + distanceFromCenter / 100

  const baseSize = 150
  const width = baseSize + Math.random() * 50 * sizeMultiplier
  const height = baseSize + Math.random() * 50 * sizeMultiplier

  return {
    id: Math.random(),
    x,
    y,
    width,
    height,
    delay: Math.random() * 0.5,
    imageUrl,
    title: `ENCRYPTED_DATA_${(index + 1).toString().padStart(3, "0")}.dat`,
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
      return { url: images[randomIndex], index: randomIndex }
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
        const newImage = generateRandomPosition(prev, nextImage.url, nextImage.index)
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
            <div className="relative" style={{ height: `${image.height}px` }}>
              <Image
                src={image.imageUrl || "/placeholder.svg"}
                alt=""
                width={image.width}
                height={image.height}
                className="object-cover"
                priority={usedImageIndices.indexOf(displayedImages.indexOf(image)) < 9} // 最初の3枚は優先読み込み
                loading="eager"
                quality={75} // 画質を少し下げてパフォーマンス改善
                sizes={`${image.width}px`}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                unoptimized
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

