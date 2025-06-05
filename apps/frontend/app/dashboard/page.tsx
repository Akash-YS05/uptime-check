"use client"
import { useState, useMemo } from "react"
import { ChevronDown, Globe, Plus, Search, Filter } from "lucide-react"
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
        status === "good" ? "bg-emerald-500" : status === "bad" ? "bg-red-500" : "bg-gray-400"
      }`}
    />
  )
}

function UptimeChart({ ticks }: { ticks: UptimeStatus[] }) {
  return (
    <div className="flex items-end gap-0.5 h-12 mt-2">
      {ticks.map((tick, index) => (
        <motion.div
          key={index}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: index * 0.02, duration: 0.3 }}
          className={`w-2 h-8 origin-bottom ${
            tick === "good" ? "bg-emerald-500" : tick === "bad" ? "bg-red-500" : "bg-gray-300"
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
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Add New Website</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                onClick={() => onClose(url)}
                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
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
  responseTime: number
}

function WebsiteCard({ website }: { website: ProcessedWebsite }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 20 }}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
    >
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <StatusCircle status={website.status} />
          <div>
          <h3 className="font-medium text-gray-900">
            {new URL(website.url).hostname.replace(/^www\./, '')}
          </h3>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Globe className="w-4 h-4" />
            <span>{website.url}</span>
          </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{website.uptimePercentage.toFixed(2)}% uptime</div>
            <div className="text-xs text-gray-500">{website.responseTime}ms</div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
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
            className="overflow-hidden border-t border-gray-200"
          >
            <div className="p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4">Status Details</h4>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Time:</span>
                      <span className="text-sm font-medium">{website.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Uptime:</span>
                      <span className="text-sm font-medium">{website.uptimePercentage.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Check:</span>
                      <span className="text-sm font-medium">just now</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`text-sm font-medium ${
                          website.status === "good" ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {website.status === "good" ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-gray-800 text-white px-3 py-2 rounded text-sm">
                    <div className="font-medium">{currentTime}</div>
                    <div className="text-emerald-400">Online</div>
                    <div className="text-xs">{website.responseTime}ms</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Last 30 Minutes Uptime</span>
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span>17:50</span>
                    <span>18:19</span>
                  </div>
                </div>
                <UptimeChart ticks={website.uptimeTicks} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function StatsCard({
  title,
  value,
  valueColor = "text-gray-900",
}: {
  title: string
  value: string | number
  valueColor?: string
}) {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
      <div className="text-sm text-gray-600 mb-1">{title}</div>
      <div className={`text-2xl font-semibold ${valueColor}`}>{value}</div>
    </motion.div>
  )
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const { websites, refreshWebsites } = useWebsites()
  const { getToken } = useAuth()

  const processedWebsites = useMemo(() => {
    return websites.map((website) => {
      // Sort ticks by creation time
      const sortedTicks = [...website.ticks].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )

      // Get the most recent 30 minutes of ticks
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
      const recentTicks = sortedTicks.filter((tick) => new Date(tick.createdAt) > thirtyMinutesAgo)

      // Aggregate ticks into 1-minute windows (30 windows total)
      const windows: UptimeStatus[] = []

      for (let i = 0; i < 30; i++) {
        const windowStart = new Date(Date.now() - (i + 1) * 1 * 60 * 1000)
        const windowEnd = new Date(Date.now() - i * 1 * 60 * 1000)

        const windowTicks = recentTicks.filter((tick) => {
          const tickTime = new Date(tick.createdAt)
          return tickTime >= windowStart && tickTime < windowEnd
        })

        // Window is considered up if majority of ticks are up
        const upTicks = windowTicks.filter((tick) => tick.status === "Good").length
        windows[29 - i] = windowTicks.length === 0 ? "unknown" : upTicks / windowTicks.length >= 0.5 ? "good" : "bad"
      }

      // Calculate overall status and uptime percentage
      const totalTicks = sortedTicks.length
      const upTicks = sortedTicks.filter((tick) => tick.status === "Good").length
      const uptimePercentage = totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100

      // Get the most recent status
      const currentStatus = windows[windows.length - 1]

      // Format the last checked time
      const lastChecked = sortedTicks[0] ? new Date(sortedTicks[0].createdAt).toLocaleTimeString() : "Never"

      // Mock response time (you can replace this with actual data)
      const responseTime = Math.floor(Math.random() * 200) + 100

      return {
        id: website.id,
        url: website.url,
        status: currentStatus,
        uptimePercentage,
        lastChecked,
        uptimeTicks: windows,
        responseTime,
      }
    })
  }, [websites])

  const filteredWebsites = processedWebsites.filter((website) =>
    website.url.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const onlineWebsites = processedWebsites.filter((w) => w.status === "good").length
  const totalWebsites = processedWebsites.length
  const systemUptime = totalWebsites > 0 ? ((onlineWebsites / totalWebsites) * 100).toFixed(2) : "0.00"

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 font-[Bodoni_Moda]">Your Status Dashboard</h1>
            <div className="flex items-center space-x-4">
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Website</span>
              </motion.button>
            </div>
          </div>
          <p className="text-gray-600">
            Last updated: {currentTime} | Click on any website to view detailed uptime information
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-800" />
            <input
              type="text"
              placeholder="Search websites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Filter className="w-4 h-4 text-gray-800" />
            <select className="border text-gray-700 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All websites</option>
              <option>Online only</option>
              <option>Offline only</option>
            </select>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-8 mb-8"
        >
          <StatsCard title="Total Websites" value={totalWebsites} />
          <StatsCard title="Websites Online" value={onlineWebsites} valueColor="text-emerald-600" />
          <StatsCard title="System Uptime" value={`${systemUptime}%`} />
        </motion.div>

        <div className="space-y-4">
          {filteredWebsites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 mb-4">
                {searchTerm ? "No websites match your search" : "No websites added yet"}
              </p>
              {!searchTerm && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add your first website</span>
                </motion.button>
              )}
            </motion.div>
          ) : (
            filteredWebsites.map((website, index) => (
              <motion.div
                key={website.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
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
