"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Unlock, AlertCircle } from "lucide-react"
import MatrixBackground from "../components/MatrixBackground"
import { useAccessAttempts } from "@/hooks/useAccessAttempts"

const MAX_ATTEMPTS = 3

export default function UnlockPage() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const router = useRouter()
  const { isLocked, incrementAttempt, resetAttempts, remainingAttempts } = useAccessAttempts(MAX_ATTEMPTS)

  const correctCode = "unlock"

  useEffect(() => {
    if (isUnlocked) {
      const timer = setTimeout(() => {
        router.push("/video")
      }, 2000)
      return () => clearTimeout(timer)
    }
    
  }, [isUnlocked, router])

  useEffect(() => {
    if (isUnlocked) {
    }
  }, [isUnlocked, router])

  const checkCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return

    if (code.toLowerCase() === correctCode) {
      setResult("ACCESS GRANTED")
      setIsUnlocked(true)
      resetAttempts()
    } else {
      setResult("ACCESS DENIED")
      incrementAttempt()
    }
    setCode("")
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono flex items-center justify-center relative overflow-hidden">
      <MatrixBackground />
      <div className="absolute inset-0 bg-black/50"></div>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="z-10 bg-black/70 p-8 rounded-lg border-2 border-green-500 shadow-lg shadow-green-500/50 w-full max-w-md"
      >
        <Terminal className="w-16 h-16 mx-auto mb-6 text-green-500" />
        <h1 className="text-4xl font-bold mb-8 text-center glitch" data-text="SYSTEM ACCESS">
          SYSTEM ACCESS
        </h1>
        <form onSubmit={checkCode} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-black border-2 border-green-500 rounded px-4 py-3 text-2xl focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-300 text-center"
              placeholder="ENTER CODE"
              autoFocus
              disabled={isLocked}
              aria-label="Access code"
              aria-describedby="codeHint"
            />
            <p id="codeHint" className="sr-only">
              Enter the access code to unlock the system
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-black py-3 rounded text-xl font-bold hover:bg-green-400 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLocked}
          >
            <Unlock className="mr-2" />
            UNLOCK
          </button>
        </form>
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`mt-6 text-3xl font-bold text-center ${isUnlocked ? "text-green-400" : "text-red-500"} glitch`}
              data-text={result}
              role="alert"
            >
              {result}
            </motion.div>
          )}
        </AnimatePresence>
        {!isLocked && remainingAttempts > 0 && (
          <p className="mt-4 text-sm text-center text-green-300">Attempts remaining: {remainingAttempts}</p>
        )}
      </motion.div>
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            role="alert"
          >
            <div className="text-center">
              <h2 className="text-6xl font-bold text-red-500 mb-8 glitch shake" data-text="ACCESS DENIED">
                ACCESS DENIED
              </h2>
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <p className="text-2xl text-red-300 mb-4">System locked</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

