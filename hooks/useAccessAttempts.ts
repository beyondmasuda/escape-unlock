import { useState, useEffect } from "react"

const DEFAULT_MAX_ATTEMPTS = 3
// const LOCKOUT_TIME = 30 * 60 * 1000 // 30 minutes in milliseconds

export function useAccessAttempts(maxAttempts = DEFAULT_MAX_ATTEMPTS) {
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  // const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null)

  useEffect(() => {
    // const storedLockoutEndTime = localStorage.getItem("lockoutEndTime")
    // if (storedLockoutEndTime) {
    //   const endTime = Number.parseInt(storedLockoutEndTime, 10)
    //   if (Date.now() < endTime) {
    //     setIsLocked(true)
    //     setLockoutEndTime(endTime)
    //   } else {
    //     localStorage.removeItem("lockoutEndTime")
    //   }
    // }
  }, [])

  const incrementAttempt = () => {
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    if (newAttempts >= maxAttempts) {
      // const endTime = Date.now() + LOCKOUT_TIME
      setIsLocked(true)
      // setLockoutEndTime(endTime)
      // localStorage.setItem("lockoutEndTime", endTime.toString())
    }
  }

  const resetAttempts = () => {
    setAttempts(0)
    setIsLocked(false)
    // setLockoutEndTime(null)
    // localStorage.removeItem("lockoutEndTime")
  }

  return { attempts, isLocked, incrementAttempt, resetAttempts }
}

