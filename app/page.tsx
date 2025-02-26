"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Unlock, AlertCircle } from "lucide-react"
import MatrixBackground from "../components/MatrixBackground"
import { useAccessAttempts } from "@/hooks/useAccessAttempts"
import AccessGrantedEffect from "@/components/AccessGrantedEffect"

const MAX_ATTEMPTS = 3

// 画像データの型定義
const IMAGES = [
  {
    url: "/escape-unlock/img/2-A.png",
    width: 2000,
    height: 1414,
  },
  {
    url: "/escape-unlock/img/2-B.png",
    width: 2000,
    height: 1414,
  },
  {
    url: "/escape-unlock/img/2-C.png",
    width: 2000,
    height: 1414,
  },
  {
    url: "/escape-unlock/img/2-D.png",
    width: 2000,
    height: 1414,
  },
  {
    url: "/escape-unlock/img/2-E.png",
    width: 2000,
    height: 1414,
  },
  {
    url: "/escape-unlock/img/2-place.png",
    width: 2000,
    height: 1414,
  },
  {
    url: "/escape-unlock/img/BEYONDEX.png",
    width: 1414,
    height: 2000,
  },
  {
    url: "/escape-unlock/img/BOMB.png",
    width: 1414,
    height: 2000,
  },
]

export default function UnlockPage() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const { isLocked, incrementAttempt, resetAttempts, remainingAttempts } = useAccessAttempts(MAX_ATTEMPTS)

  const correctCode = "トモツク"

  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        setResult("")
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [result])

  const checkCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return

    if (code === correctCode) {
      setResult("ACCESS GRANTED")
      setIsUnlocked(true)
      resetAttempts()
      // コードの入力値を維持
    } else {
      setResult("ACCESS DENIED")
      incrementAttempt()
      setCode("") // エラー時のみ入力をクリア
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono relative overflow-hidden">
      <MatrixBackground />
      <div className="absolute inset-0 bg-black/50" />
      {isUnlocked && <AccessGrantedEffect images={IMAGES} />}
      <div className="relative z-50 min-h-screen container mx-auto px-4 py-8 flex items-center justify-center">
        <motion.div
          key="initial-lock"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-black/70 p-8 sm:p-12 rounded-lg border-2 border-green-500 shadow-lg shadow-green-500/50 w-full max-w-xl lg:max-w-2xl xl:max-w-3xl relative"
        >
          <Terminal className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-6 text-green-500" />
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 sm:mb-12 text-center matrix-effect"
            data-text="SYSTEM ACCESS"
          >
            SYSTEM ACCESS
          </h1>
          <form onSubmit={checkCode} className="space-y-6 sm:space-y-8">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full bg-black border-2 ${
                  isUnlocked ? "border-green-400" : "border-green-500"
                } rounded px-4 py-3 sm:py-4 text-xl sm:text-2xl lg:text-3xl focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-300 text-center ${
                  isUnlocked ? "text-green-400" : "text-green-500"
                }`}
                placeholder="ENTER CODE"
                autoFocus
                disabled={isLocked}
                aria-label="Access code"
                aria-describedby="codeHint"
                readOnly={isUnlocked}
              />
              <p id="codeHint" className="sr-only">
                Enter the access code to unlock the system
              </p>
            </div>
            <button
              type="submit"
              className={`w-full ${
                isUnlocked ? "bg-green-400" : "bg-green-500"
              } text-black py-3 sm:py-4 rounded text-xl sm:text-2xl font-bold hover:bg-green-400 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isLocked || isUnlocked}
            >
              <Unlock className="mr-2 w-6 h-6 sm:w-7 sm:h-7" />
              {isUnlocked ? "UNLOCKED" : "UNLOCK"}
            </button>
          </form>
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className={`mt-6 sm:mt-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-center ${
                  isUnlocked ? "text-green-400" : "text-red-500"
                } matrix-effect`}
                data-text={result}
                role="alert"
              >
                {result}
              </motion.div>
            )}
          </AnimatePresence>
          {!isLocked && remainingAttempts > 0 && !isUnlocked && (
            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-center text-green-300">
              Attempts remaining: {remainingAttempts}
            </p>
          )}
        </motion.div>
      </div>
      <AnimatePresence>
        {isLocked && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]"
            role="alert"
          >
            <div className="text-center px-4">
              <h2
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-red-500 mb-8 matrix-effect shake"
                data-text="ACCESS DENIED"
              >
                ACCESS DENIED
              </h2>
              <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-red-500" />
              <p className="text-xl sm:text-2xl text-red-300 mb-4">System locked</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

