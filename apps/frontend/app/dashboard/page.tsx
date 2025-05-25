"use client"
import React, { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, Globe, Plus, Moon, Sun } from "lucide-react"
import { useWebsites } from "../hooks/useWebsites"
import axios from "axios"
import { BACKEND_API_URL } from "@/config"
import { useAuth } from "@clerk/nextjs"

type UptimeStatus = "good" | "bad" | "unknown"

function StatusCircle({ status }: { status: UptimeStatus }) {
  return (
    <div
      className={`w-3 h-3 rounded-full ${status === "good" ? "bg-gradient-to-r from-green-400 to-green-500" : status === "bad" ? "bg-gradient-to-r from-red-400 to-red-500" : "bg-gray-400"}`}
    />
  )
}

function UptimeTicks({ ticks }: { ticks: UptimeStatus[] }) {
  return (
    <div className="flex gap-1 mt-2">
      {ticks.map((tick, index) => (
        <div
          key={index}
          className={`w-8 h-2 rounded-full ${
            tick === "good"
              ? "bg-gradient-to-r from-green-400 to-green-500"
              : tick === "bad"
                ? "bg-gradient-to-r from-red-400 to-red-500"
                : "bg-gray-400"
          }`}
        />
      ))}
    </div>
  )
}

function CreateWebsiteModal({ isOpen, onClose }: { isOpen: boolean; onClose: (url: string | null) => void }) {
  const [url, setUrl] = useState("")
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-light mb-4 dark:text-white">Add New Website</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
          <input
            type="url"
            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-full dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={() => onClose(null)}
            className="px-6 py-3 text-sm font-light text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={() => onClose(url)}
            className="px-6 py-3 text-sm font-light text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 rounded-full shadow-lg shadow-blue-600/20 transition-all"
          >
            Add Website
          </button>
        </div>
      </div>
    </div>
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
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
            className={`text-sm font-light ${website.status === "good" ? "text-green-500" : website.status === "bad" ? "text-red-500" : "text-gray-500"}`}
          >
            {website.uptimePercentage.toFixed(1)}% uptime
          </span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${isExpanded ? "bg-gray-100 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          <div className="mt-3">
            <p className="text-sm font-light text-gray-600 dark:text-gray-300 mb-1">Last 30 minutes status:</p>
            <UptimeTicks ticks={website.uptimeTicks} />
          </div>
          <p className="text-xs font-light text-gray-500 dark:text-gray-400 mt-2">
            Last checked: {website.lastChecked}
          </p>
        </div>
      )}
    </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 relative">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600/10 to-blue-600/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600" />
            </div>
            <h1 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">Uptime Monitor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:opacity-90 transition-all shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4" />
              <span className="font-light">Add Website</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {processedWebsites.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 font-light mb-4">No websites added yet</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full hover:opacity-90 transition-all shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                <span className="font-light">Add your first website</span>
              </button>
            </div>
          ) : (
            processedWebsites.map((website) => <WebsiteCard key={website.id} website={website} />)
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
