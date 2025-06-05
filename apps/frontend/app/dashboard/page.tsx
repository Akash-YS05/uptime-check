"use client"
import React, { useState, useMemo } from "react"
import { ChevronDown, Globe, Plus, Moon, Sun } from "lucide-react"
import { useWebsites } from "../hooks/useWebsites"
import axios from "axios"
import { BACKEND_API_URL } from "@/config"
import { useAuth } from "@clerk/nextjs"
import { motion, AnimatePresence } from "framer-motion"

type UptimeStatus = "good" | "bad" | "unknown"

function StatusCircle({ status }: { status: UptimeStatus }) {
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className={`w-3 h-3 rounded-full ${
        status === "good"
          ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
          : status === "bad"
            ? "bg-gradient-to-r from-rose-400 to-rose-500"
            : "bg-gray-400"
      }`}
    />
  )
}

function UptimeTicks({ ticks }: { ticks: UptimeStatus[] }) {
  return (
    <div className="flex gap-1 mt-2">
      {ticks.map((tick, index) => (
        <motion.div
          key={index}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: index * 0.03, duration: 0.3 }}
          className={`w-8 h-2 rounded-full origin-bottom ${
            tick === "good"
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
              : tick === "bad"
                ? "bg-gradient-to-r from-rose-400 to-rose-500"
                : "bg-gray-400"
          }`}
        />
      ))}
    </div>
  )
}

function CreateWebsiteModal({ isOpen, onClose }: { isOpen: boolean; onClose: (url: string | null) => void }) {
  const [url, setUrl] = useState("")

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <h2 className="text-xl font-light mb-4 dark:text-white">Add New Website</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
              <input
                type="url"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onClose(null)}
                className="px-6 py-3 text-sm font-light text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                onClick={() => onClose(url)}
                className="px-6 py-3 text-sm font-light text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 rounded-lg shadow-lg shadow-indigo-600/20 transition-all"
              >
                Add Website
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface ProcessedWebsite {
  id: string
  url: string
  status: UptimeStatus
  uptimePercentage: number
  lastChecked: string
  uptimeTicks: UptimeStatus[]
}

function WebsiteCard({ website }: { website: ProcessedWebsite }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
    >
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <StatusCircle status={website.status} />
          <div>
            <h3 className="font-light text-gray-900 dark:text-white">{website.url}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`text-sm font-light ${
              website.status === "good"
                ? "text-emerald-500"
                : website.status === "bad"
                  ? "text-rose-500"
                  : "text-gray-500"
            }`}
          >
            {website.uptimePercentage.toFixed(1)}% uptime
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isExpanded ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800"
            }`}
          >
            <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
              <div className="mt-3">
                <p className="text-sm font-light text-gray-600 dark:text-gray-300 mb-1">Last 30 minutes status:</p>
                <UptimeTicks ticks={website.uptimeTicks} />
              </div>
              <p className="text-xs font-light text-gray-500 dark:text-gray-400 mt-2">
                Last checked: {website.lastChecked}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { websites, refreshWebsites } = useWebsites()
  const { getToken } = useAuth()

  const processedWebsites = useMemo(() => {
    return websites.map((website) => {
      // Sort ticks by creation time
      //@ts-ignore
      const sortedTicks = [...website.ticks].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      // Get the most recent 30 minutes of ticks
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
      const recentTicks = sortedTicks.filter((tick) => new Date(tick.createdAt) > thirtyMinutesAgo)

      // Aggregate ticks into 3-minute windows (10 windows total)
      const windows: UptimeStatus[] = []

      for (let i = 0; i < 10; i++) {
        const windowStart = new Date(Date.now() - (i + 1) * 3 * 60 * 1000)
        const windowEnd = new Date(Date.now() - i * 3 * 60 * 1000)

        const windowTicks = recentTicks.filter((tick) => {
          const tickTime = new Date(tick.createdAt)
          return tickTime >= windowStart && tickTime < windowEnd
        })

        // Window is considered up if majority of ticks are up
        const upTicks = windowTicks.filter((tick) => tick.status === "Good").length
        windows[9 - i] = windowTicks.length === 0 ? "unknown" : upTicks / windowTicks.length >= 0.5 ? "good" : "bad"
      }

      // Calculate overall status and uptime percentage
      const totalTicks = sortedTicks.length
      const upTicks = sortedTicks.filter((tick) => tick.status === "Good").length
      const uptimePercentage = totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100

      // Get the most recent status
      const currentStatus = windows[windows.length - 1]

      // Format the last checked time
      const lastChecked = sortedTicks[0] ? new Date(sortedTicks[0].createdAt).toLocaleTimeString() : "Never"

      return {
        id: website.id,
        url: website.url,
        status: currentStatus,
        uptimePercentage,
        lastChecked,
        uptimeTicks: windows,
      }
    })
  }, [websites])

  // Toggle dark mode
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300"></div>
        <motion.div
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 20,
            ease: "easeInOut",
          }}
          className="absolute -top-24 -right-24 w-96 h-96 bg-violet-100 dark:bg-violet-900/20 rounded-full opacity-50 blur-3xl"
        ></motion.div>
        <motion.div
          animate={{
            x: [0, -10, 0],
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 25,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 -left-24 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/20 rounded-full opacity-50 blur-3xl"
        ></motion.div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 relative">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.7 }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600/10 to-indigo-600/10 flex items-center justify-center"
            >
              <Globe className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600" />
            </motion.div>
            <h1 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">Uptime Monitor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span className="font-light">Add Website</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="space-y-4">
          {processedWebsites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 dark:text-gray-400 font-light mb-4">No websites added yet</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-all shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                <span className="font-light">Add your first website</span>
              </motion.button>
            </motion.div>
          ) : (
            processedWebsites.map((website, index) => (
              <motion.div
                key={website.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <WebsiteCard website={website} />
              </motion.div>
            ))
          )}
        </div>
      </div>

      <CreateWebsiteModal
        isOpen={isModalOpen}
        onClose={async (url) => {
          if (url === null) {
            setIsModalOpen(false)
            return
          }

          const token = await getToken()
          setIsModalOpen(false)
          axios
            .post(
              `${BACKEND_API_URL}/api/v1/website`,
              {
                url,
              },
              {
                headers: {
                  Authorization: token,
                },
              },
            )
            .then(() => {
              refreshWebsites()
            })
        }}
      />
    </div>
  )
}

export default App
