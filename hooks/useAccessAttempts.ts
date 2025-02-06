"use client"

import { useState } from "react"

export function useAccessAttempts(maxAttempts: number) {
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)

  const incrementAttempt = () => {
    const newAttempts = Math.min(attempts + 1, maxAttempts)
    setAttempts(newAttempts)
    if (newAttempts >= maxAttempts) {
      setIsLocked(true)
    }
  }

  const resetAttempts = () => {
    setAttempts(0)
    setIsLocked(false)
  }

  return {
    attempts,
    isLocked,
    incrementAttempt,
    resetAttempts,
    remainingAttempts: Math.max(0, maxAttempts - attempts),
  }
}

