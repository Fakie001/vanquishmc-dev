"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"

export function HeroSection() {
  const [serverStatus, setServerStatus] = useState({
    online: true, // Default to online to avoid UI flicker
    players: { online: 123, max: 500 }, // Default values
  })

  // Generate blossom positions on client-side only to avoid hydration mismatch
  const [blossomPositions, setBlossomPositions] = useState<{ left: string }[]>([])

  // Initialize blossom positions on client-side only
  useEffect(() => {
    // Generate 20 random positions for blossoms
    const positions = Array(20)
      .fill(0)
      .map(() => ({
        left: `${Math.random() * 100}%`,
      }))
    setBlossomPositions(positions)
  }, [])

  useEffect(() => {
    const fetchServerStatus = async () => {
      try {
        // Try to fetch server status
        const response = await fetch("/api/server-status")

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`)
        }

        const data = await response.json()
        setServerStatus({
          online: data.online,
          players: {
            online: data.players.online,
            max: data.players.max,
          },
        })
      } catch (error) {
        console.error("Failed to fetch server status:", error)
        // Keep using default values on error - no need to update state
      }
    }

    fetchServerStatus()
    const interval = setInterval(fetchServerStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  // Falling cherry blossom animation variants
  const blossom = useMemo(
    () => ({
      initial: {
        y: -20,
        x: 0,
        opacity: 0,
        rotate: 0,
      },
      animate: {
        y: ["0%", "100%"],
        x: ["0%", "50%", "-50%", "0%"],
        opacity: [0, 1, 1, 0],
        rotate: [0, 45, -45, 0],
        transition: {
          duration: 5,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        },
      },
    }),
    [],
  )

  const serverIP = "vanquishmc.com"

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/backgrond1.png-OxqdqwvCiqPQOIojHe6aglphrF6KNt.webp)`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
        }}
      />
      <div className="absolute inset-0 bg-black/50" />

      {/* Animated Cherry Blossoms - Client-side only to avoid hydration issues */}
      {blossomPositions.map((position, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-pink-400/20 rounded-full"
          style={{
            left: position.left,
            top: -20,
          }}
          variants={blossom}
          initial="initial"
          animate="animate"
          transition={{
            delay: Math.random() * 5, // Random delay still works after hydration
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 px-4 max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-br from-rose-300 via-purple-400 to-indigo-500 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to Our Minecraft Server
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-white/90"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Join the adventure, build, explore, and make new friends!
        </motion.p>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="space-y-4">
            <p className="text-white/80">Server IP:</p>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <code className="px-3 py-2 rounded-lg bg-black/30 backdrop-blur-sm text-white font-mono text-sm">
                  {serverIP}
                </code>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/30 backdrop-blur-sm">
                  <div className={`w-2 h-2 rounded-full ${serverStatus.online ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="text-sm text-white/80">
                    {serverStatus.players.online}/{serverStatus.players.max} Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

