'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { loadPublicStats } from '@/lib/public-stats'

interface Stats {
  githubStars?: number
  npmDownloads?: number
  contributors?: number
  openIssues?: number
}

export function RealStats() {
  const [stats, setStats] = useState<Stats>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    loadPublicStats().then((blob) => {
      if (cancelled) return
      const agentos = blob?.repos?.['framersai/agentos']
      setStats({
        githubStars: agentos?.stars,
        npmDownloads: blob?.npm?.['@framers/agentos'] ?? undefined,
        contributors: blob?.aggregate?.agentosContributors ?? undefined,
        openIssues: agentos?.openIssues,
      })
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  // Only live stats (no fake numbers). Contributors temporarily omitted.
  const statItems = [
    {
      value: stats.githubStars ? stats.githubStars.toLocaleString() : '—',
      label: 'GitHub Stars',
      icon: '⭐',
      loading: loading && !stats.githubStars
    },
    {
      value: stats.npmDownloads ? `${(stats.npmDownloads / 1000).toFixed(1)}k` : '—',
      label: 'Weekly Downloads',
      icon: '📦',
      loading: loading && !stats.npmDownloads
    },
    // {
    //   value: stats.contributors ? `${stats.contributors}+` : '—',
    //   label: 'Contributors',
    //   icon: '👥',
    //   loading: loading && !stats.contributors
    // },
    {
      value: 'Apache 2.0',
      label: 'Open Source',
      icon: '✨',
      loading: false
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="text-center"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              {stat.loading ? (
                <div className="h-9 flex items-center justify-center">
                  <div className="w-16 h-6 bg-background-tertiary animate-pulse rounded" />
                </div>
              ) : (
                <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
              )}
              <div className="text-sm text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}