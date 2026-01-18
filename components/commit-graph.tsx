"use client"

import { useEffect, useState, useRef } from "react"
import { useTheme } from "next-themes"
import { FaGithub } from "react-icons/fa"

interface ContributionDay {
  contributionCount: number
  date: string
}

interface ContributionWeek {
  contributionDays: (ContributionDay | null)[]
}

interface ContributionData {
  totalContributions: number
  weeks: ContributionWeek[]
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function getContributionLevel(count: number): number {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function normalizeContributionWeeks(weeks: ContributionWeek[]): ContributionWeek[] {
  if (weeks.length === 0) return []

  const parseUTC = (date: string) => new Date(`${date}T00:00:00Z`)

  const allDays = weeks.flatMap((week) => week.contributionDays).filter(Boolean) as ContributionDay[]

  const firstMondayIndex = allDays.findIndex((day) => parseUTC(day.date).getUTCDay() === 1)
  const alignedDays = firstMondayIndex === -1 ? allDays : allDays.slice(firstMondayIndex)

  const normalizedWeeks: ContributionWeek[] = []

  for (let i = 0; i < alignedDays.length; i += 7) {
    const weekDays: (ContributionDay | null)[] = alignedDays.slice(i, i + 7)
    while (weekDays.length < 7) {
      weekDays.push(null)
    }
    normalizedWeeks.push({ contributionDays: weekDays })
  }

  return normalizedWeeks
}

function generateSkeletonWeeks(): ContributionWeek[] {
  const skeletonWeeks: ContributionWeek[] = []
  
  for (let week = 0; week < 53; week++) {
    const weekDays: (ContributionDay | null)[] = []
    for (let day = 0; day < 7; day++) {
      weekDays.push({
        contributionCount: 0,
        date: "",
      })
    }
    skeletonWeeks.push({ contributionDays: weekDays })
  }
  
  return skeletonWeeks
}

export default function CommitGraph() {
  const { resolvedTheme } = useTheme()
  const [data, setData] = useState<ContributionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [tooltip, setTooltip] = useState<{
    visible: boolean
    x: number
    y: number
    date: string
    count: number
    showBelow: boolean
  }>({ visible: false, x: 0, y: 0, date: "", count: 0, showBelow: false })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    fetchContributions()
  }, [])

  async function fetchContributions() {
    try {
      const response = await fetch("/api/github")
      if (!response.ok) throw new Error("Failed to fetch")
      const result = await response.json()
      setData(result)
      setError(null)
    } catch {
      setError("Failed to load contributions")
    } finally {
      setLoading(false)
    }
  }

  // Find the first Monday and trim weeks before it
  function getWeeksStartingMonday(weeks: ContributionWeek[]): ContributionWeek[] {
    if (weeks.length === 0) return []

    const firstWeek = weeks[0]
    const firstDayEntry = firstWeek.contributionDays[0]
    if (!firstDayEntry || !firstDayEntry.date) {
      return weeks
    }

    const firstDay = new Date(`${firstDayEntry.date}T00:00:00Z`)
    const dayOfWeek = firstDay.getUTCDay()

    if (dayOfWeek === 1) {
      return weeks
    }

    return weeks.slice(1)
  }

  function handleMouseEnter(e: React.MouseEvent, day: ContributionDay, dayIndex: number) {
    const rect = e.currentTarget.getBoundingClientRect()
    const containerRect = containerRef.current?.getBoundingClientRect()
    
    if (containerRect) {
      // Show tooltip below for top 2 rows (dayIndex 0 and 1)
      const showBelow = dayIndex < 2
      setTooltip({
        visible: true,
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top,
        date: day.date,
        count: day.contributionCount,
        showBelow,
      })
    }
  }

  function handleMouseLeave() {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }

  // Get month labels with their week positions
  function getMonthLabels(weeks: ContributionWeek[]) {
    const labels: { month: string; weekIndex: number; span: number; show: boolean }[] = []
    let lastMonth = -1

    const rawLabels: { month: string; weekIndex: number }[] = []

    weeks.forEach((week, weekIndex) => {
      const firstDay = week.contributionDays[0]
      if (firstDay) {
        const month = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth()
        if (month !== lastMonth) {
          rawLabels.push({ month: MONTHS[month], weekIndex })
          lastMonth = month
        }
      }
    })

    rawLabels.forEach((label, i) => {
      const nextIndex = rawLabels[i + 1]?.weekIndex ?? weeks.length
      const weeksSpan = nextIndex - label.weekIndex
      labels.push({
        ...label,
        span: weeksSpan,
        show: weeksSpan >= 2,
      })
    })

    return labels
  }

  // Get color class based on level and theme
  function getColorClass(level: number): string {
    if (level === 0) return "bg-muted"
    
    // Use resolvedTheme only after component has mounted to prevent hydration mismatch
    // During SSR, resolvedTheme is undefined, so we default to light mode
    const isDark = mounted && resolvedTheme !== undefined && resolvedTheme === "dark"
    
    if (isDark) {
      // Dark mode: keep as is (darker = less, lighter = more)
      switch (level) {
        case 1: return "bg-[#0e4429]"
        case 2: return "bg-[#006d32]"
        case 3: return "bg-[#26a641]"
        case 4: return "bg-[#39d353]"
        default: return "bg-muted"
      }
    } else {
      // Light mode: swap colors (darker = more, lighter = less)
      switch (level) {
        case 1: return "bg-[#39d353]"
        case 2: return "bg-[#26a641]"
        case 3: return "bg-[#006d32]"
        case 4: return "bg-[#1a5f2e]"
        default: return "bg-muted"
      }
    }
  }

  const normalizedWeeks = data ? normalizeContributionWeeks(data.weeks) : generateSkeletonWeeks()
  const displayWeeks = data ? getWeeksStartingMonday(normalizedWeeks) : normalizedWeeks
  const monthLabels = data ? getMonthLabels(displayWeeks) : []

  const cellSize = 20
  const cellGap = 4
  const dayLabelWidth = 40

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(2rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.7s ease-out forwards;
        }
      `}</style>
      
      <section 
        id="commits"
        className="relative py-12 animate-fade-in-up"
        style={{ animationDelay: '400ms' }}
      >
        <div className="w-full px-6 md:px-12 lg:px-16">
        {/* Header with username as link */}
        <div className="flex justify-center mb-6">
          <a
            href="https://github.com/EwanClark"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 text-foreground transition-colors hover:text-primary"
          >
            <FaGithub className="w-5 h-5 transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:scale-105" />
            <span className="font-medium text-base transition-transform duration-150 ease-out group-hover:-translate-y-0.5">
              @ewanclark
            </span>
          </a>
        </div>

        {/* Graph container */}
        <div
          ref={containerRef}
          className="relative overflow-x-auto flex justify-center"
        >
          {error ? (
            <div className="flex items-center justify-center h-40 text-muted-foreground">
              {error}
            </div>
          ) : (
            <div className="inline-block">
              {/* Month labels row */}
              <div 
                className="flex text-xs text-muted-foreground mb-2"
                style={{ paddingLeft: dayLabelWidth }}
              >
                {data && monthLabels.map((label, i) => {
                  return (
                    <div
                      key={`${label.month}-${label.weekIndex}`}
                      style={{ 
                        width: label.span * (cellSize + cellGap),
                      }}
                    >
                      {label.show ? label.month : ""}
                    </div>
                  )
                })}
              </div>

              {/* Grid with day labels */}
              <div className="flex">
                {/* Day labels column */}
                <div 
                  className="flex flex-col text-xs text-muted-foreground"
                  style={{ width: dayLabelWidth }}
                >
                  {["Mon", "", "Wed", "", "Fri", "", "Sun"].map((day, i) => (
                    <div
                      key={i}
                      className="flex items-center"
                      style={{ height: cellSize + cellGap }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Contribution grid */}
                <div className="flex" style={{ gap: cellGap }} suppressHydrationWarning>
                  {displayWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col" style={{ gap: cellGap }}>
                      {week.contributionDays.map((day, dayIndex) => {
                        if (!day) return <div key={dayIndex} style={{ width: cellSize, height: cellSize }} />
                        const level = getContributionLevel(day.contributionCount)
                        return (
                          <div
                            key={dayIndex}
                            style={{ width: cellSize, height: cellSize }}
                            className={`rounded-[3px] transition-all duration-150 ${data ? 'cursor-pointer hover:ring-2 hover:ring-foreground/20 hover:ring-offset-1 hover:ring-offset-background' : ''} ${getColorClass(level)}`}
                            onMouseEnter={data ? (e) => handleMouseEnter(e, day, dayIndex) : undefined}
                            onMouseLeave={data ? handleMouseLeave : undefined}
                          />
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend and contribution count */}
              <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground" suppressHydrationWarning>
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      style={{ width: cellSize, height: cellSize }}
                      className={`rounded-[3px] ${getColorClass(level)}`}
                    />
                  ))}
                  <span>More</span>
                </div>
                {data && (
                  <a
                    href="https://github.com/EwanClark"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {data.totalContributions.toLocaleString()} contributions in the last year
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Tooltip */}
          {tooltip.visible && (
            <div
              className="absolute z-50 px-3 py-2 text-sm bg-popover border border-border text-popover-foreground rounded-md shadow-lg pointer-events-none whitespace-nowrap"
              style={{ 
                left: tooltip.x, 
                top: tooltip.showBelow ? tooltip.y + cellSize + 10 : tooltip.y - 10,
                transform: tooltip.showBelow ? "translate(-50%, 0%)" : "translate(-50%, -100%)"
              }}
            >
              <span className="font-semibold">{tooltip.count} contribution{tooltip.count !== 1 ? "s" : ""}</span>
              <span className="text-muted-foreground"> on {formatDate(tooltip.date)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  )
}
