"use client"

import type React from "react"
import { useEffect, useRef, useCallback } from "react"

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const calculateFontSize = (width: number): number => {
    // 画面幅に応じてフォントサイズを計算
    // ベースは15px、画面幅2000pxで最大30px
    const minSize = 12
    const maxSize = 30
    const size = Math.max(minSize, Math.min(maxSize, width / 66))
    return Math.floor(size)
  }

  const calculateColumnSpacing = (width: number): number => {
    // フォントサイズに基づいてカラム間隔を計算
    const fontSize = calculateFontSize(width)
    return fontSize * 1.3 // フォントサイズの1.3倍をカラム間隔に
  }

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, columns: number, drops: number[], fontSize: number, columnSpacing: number) => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      ctx.fillStyle = "#0f0"
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ビヨンド\/\\.,]:;[@^-!?><_}*+{`~=)('&%$#\"";
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * columnSpacing
        const y = drops[i] * fontSize

        // 文字の不透明度をランダムに変化させる
        const alpha = 0.5 + Math.random() * 0.5
        ctx.fillStyle = `rgba(0, 255, 0, ${alpha})`

        ctx.fillText(text, x, y)

        // 画面外に出たら確率で位置をリセット
        if (y > ctx.canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
      }
    },
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      // デバイスのピクセル比を考慮してキャンバスをスケール
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const getColumns = () => {
      const spacing = calculateColumnSpacing(window.innerWidth)
      return Math.ceil(window.innerWidth / spacing)
    }

    let columns = getColumns()
    let drops: number[] = new Array(columns).fill(1)
    let fontSize = calculateFontSize(window.innerWidth)
    let columnSpacing = calculateColumnSpacing(window.innerWidth)
    let animationFrameId: number

    const animate = () => {
      // ウィンドウサイズが変更された場合に再計算
      const newColumns = getColumns()
      if (columns !== newColumns) {
        columns = newColumns
        drops = new Array(columns).fill(1)
      }

      fontSize = calculateFontSize(window.innerWidth)
      columnSpacing = calculateColumnSpacing(window.innerWidth)
      draw(ctx, columns, drops, fontSize, columnSpacing)
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

