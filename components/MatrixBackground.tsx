"use client"

import type React from "react"
import { useEffect, useRef, useCallback } from "react"

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const draw = useCallback((ctx: CanvasRenderingContext2D, columns: number, drops: number[]) => {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.fillStyle = "#0f0"
    ctx.font = "15px monospace"

    for (let i = 0; i < drops.length; i++) {
      const text = String.fromCharCode(Math.random() * 128)
      ctx.fillText(text, i * 20, drops[i] * 20)

      if (drops[i] * 20 > ctx.canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }

      drops[i]++
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const getColumns = () => Math.max(1, Math.floor(canvas.width / 20))
    let columns = getColumns()
    let drops: number[] = new Array(columns).fill(1)

    let animationFrameId: number

    const animate = () => {
      columns = getColumns()
      if (drops.length !== columns) {
        drops = new Array(columns).fill(1)
      }
      draw(ctx, columns, drops)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [draw])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}

export default MatrixBackground

