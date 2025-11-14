'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Github, ExternalLink, Package, Shield, Mic,
  Puzzle, Database, Globe, Users, BookOpen,
  Terminal, Brain, Code2, GitBranch
} from 'lucide-react'

interface Repository {
  name: string
  description: string
  url: string
  category: 'core' | 'tools' | 'apps' | 'infrastructure' | 'community'
  icon: React.ElementType
  language?: string
  stars?: number
  status: 'stable' | 'beta' | 'experimental'
  lastUpdated?: string
}

type LiveStats = {
  repos: number
  stars: number | null
  downloads: number | null
  loading: boolean
}

type RepoStat = {
  stars: number
  updatedAt: string
}

const repositories: Repository[] = [
  // Core
  {
    name: 'AgentOS',
    description: 'TypeScript runtime for adaptive AI agent intelligence. Core framework for building autonomous agents.',
    url: 'https://github.com/framersai/agentos',
    category: 'core',
    icon: Brain,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '12 hours ago'
  },
  {
    name: 'AgentOS Extensions',
    description: 'Extensions registry for AgentOS. Add capabilities like vision, speech, and custom tools.',
    url: 'https://github.com/framersai/agentos-extensions',
    category: 'tools',
    icon: Puzzle,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '6 hours ago'
  },
  {
    name: 'AgentOS Client',
    description: 'Local playground environment for AgentOS experiences. Test and debug agents locally.',
    url: 'https://github.com/framersai/agentos-client',
    category: 'tools',
    icon: Terminal,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: 'yesterday'
  },
  {
    name: 'AgentOS Guardrails',
    description: 'Safety and compliance packages for AgentOS. Implement content filtering and usage policies.',
    url: 'https://github.com/framersai/agentos-guardrails',
    category: 'core',
    icon: Shield,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '12 hours ago'
  },

  // Apps
  {
    name: 'Voice Chat Assistants',
    description: 'Marketplace for Voice Chat Assistants. Browse and deploy pre-built voice agents.',
    url: 'https://github.com/framersai/voice-chat-assistants',
    category: 'apps',
    icon: Mic,
    language: 'TypeScript',
    status: 'beta',
    lastUpdated: '3 days ago'
  },
  {
    name: 'Frame.dev',
    description: 'Main Frame.dev landing and developer portal. Central hub for all Frame products.',
    url: 'https://github.com/framersai/frame.dev',
    category: 'apps',
    icon: Globe,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '2 minutes ago'
  },
  {
    name: 'AgentOS.sh',
    description: 'Marketing site and documentation hub for AgentOS. This website!',
    url: 'https://github.com/framersai/agentos.sh',
    category: 'apps',
    icon: BookOpen,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '48 minutes ago'
  },

  // OpenStrand Ecosystem
  {
    name: 'OpenStrand',
    description: 'Open-source protocols and datasets for shifting technological landscapes.',
    url: 'https://github.com/framersai/openstrand',
    category: 'core',
    icon: GitBranch,
    language: 'Protocol',
    status: 'experimental',
    lastUpdated: '5 days ago'
  },
  {
    name: 'OpenStrand App',
    description: 'Desktop and mobile client for OpenStrand community and teams editions.',
    url: 'https://github.com/framersai/openstrand-app',
    category: 'apps',
    icon: Package,
    language: 'TypeScript',
    status: 'beta',
    lastUpdated: '33 minutes ago'
  },
  {
    name: 'OpenStrand SDK',
    description: 'TypeScript SDK for working with OpenStrand documents and protocols.',
    url: 'https://github.com/framersai/openstrand-sdk',
    category: 'tools',
    icon: Code2,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '1 hour ago'
  },

  // Infrastructure
  {
    name: 'SQL Storage Adapter',
    description: `Universal SQL storage for cross-platform builds with smart fallbacks and syncing.${process.env.NEXT_PUBLIC_SQL_ADAPTER_VERSION ? ` Latest: v${process.env.NEXT_PUBLIC_SQL_ADAPTER_VERSION}` : ''}`,
    url: 'https://github.com/framersai/sql-storage-adapter',
    category: 'infrastructure',
    icon: Database,
    language: 'TypeScript',
    status: 'stable',
    lastUpdated: '12 hours ago'
  },
  {
    name: 'Codex',
    description: 'AI and human-curated knowledge store mapping humanity\'s best knowledge.',
    url: 'https://github.com/framersai/codex',
    category: 'core',
    icon: BookOpen,
    language: 'Mixed',
    status: 'experimental',
    lastUpdated: '2 weeks ago'
  },

  // Community
  {
    name: 'Discussions',
    description: 'Public discourse forum for the Framers community. Ask questions and share ideas.',
    url: 'https://github.com/framersai/discussions',
    category: 'community',
    icon: Users,
    status: 'stable',
    lastUpdated: '3 days ago'
  }
]

const categoryInfo = {
  core: {
    title: 'Core Framework',
    description: 'Essential components and protocols',
    color: 'from-blue-500 to-cyan-500'
  },
  tools: {
    title: 'Developer Tools',
    description: 'SDKs, clients, and extensions',
    color: 'from-purple-500 to-pink-500'
  },
  apps: {
    title: 'Applications',
    description: 'Ready-to-use applications and platforms',
    color: 'from-green-500 to-emerald-500'
  },
  infrastructure: {
    title: 'Infrastructure',
    description: 'Storage, deployment, and operations',
    color: 'from-orange-500 to-red-500'
  },
  community: {
    title: 'Community',
    description: 'Forums, discussions, and resources',
    color: 'from-indigo-500 to-purple-500'
  }
}

export function EcosystemSection() {
  const [liveStats, setLiveStats] = useState<LiveStats>({
    repos: repositories.length,
    stars: null,
    downloads: null,
    loading: true
  })
  const [repoStats, setRepoStats] = useState<Record<string, RepoStat>>({})

  useEffect(() => {
    let cancelled = false
    const fetchStats = async () => {
      try {
        const repoTargets = ['agentos', 'agentos-extensions', 'agentos-client']
        const githubResponses = await Promise.all(
          repoTargets.map(async (repo) => {
            const response = await fetch(`https://api.github.com/repos/framersai/${repo}`)
            if (!response.ok) {
              throw new Error('github')
            }
            return response.json()
          })
        )
        const stars = githubResponses.reduce(
          (sum, repo) => sum + (repo?.stargazers_count ?? 0),
          0
        )
        const npmResponse = await fetch('https://api.npmjs.org/downloads/point/last-week/%40framersai%2Fagentos')
        const npmJson = npmResponse.ok ? await npmResponse.json() : null
        const downloads = npmJson?.downloads ?? null
        if (!cancelled) {
          setLiveStats({
            repos: repositories.length,
            stars,
            downloads,
            loading: false
          })
        }
      } catch {
        if (!cancelled) {
          setLiveStats((prev) => ({ ...prev, loading: false }))
        }
      }
    }
    fetchStats()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    const slugs = Array.from(
      new Set(
        repositories
          .map((repo) => repo.url.match(/github.com\/framersai\/([^/]+)/)?.[1])
          .filter((slug): slug is string => Boolean(slug))
      )
    )

    const fetchRepoStats = async () => {
      try {
        const responses = await Promise.all(
          slugs.map(async (slug) => {
            const response = await fetch(`https://api.github.com/repos/framersai/${slug}`)
            if (!response.ok) return null
            const data = await response.json()
            return {
              slug,
              stars: data?.stargazers_count ?? 0,
              updatedAt: data?.updated_at ?? new Date().toISOString()
            }
          })
        )
        if (!cancelled) {
          const next: Record<string, RepoStat> = {}
          responses.forEach((entry) => {
            if (!entry) return
            next[entry.slug] = { stars: entry.stars, updatedAt: entry.updatedAt }
          })
          setRepoStats(next)
        }
      } catch {
        // swallow; we already have fallback copy
      }
    }
    fetchRepoStats()
    return () => {
      cancelled = true
    }
  }, [])

  const statsConfig = [
    { label: 'Repositories', value: liveStats.repos, icon: GitBranch },
    { label: 'Weekly Downloads', value: liveStats.downloads, icon: Package },
    { label: 'GitHub Stars', value: liveStats.stars, icon: Github }
  ] as const

  const formatNumber = (value: number | null) => {
    if (value === null || Number.isNaN(value)) return null
    return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-theme" aria-labelledby="ecosystem-heading">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-accent-primary) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 id="ecosystem-heading" className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-accent-primary dark:to-accent-secondary bg-clip-text text-transparent">
            The AgentOS Ecosystem
          </h2>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            Explore the portable AgentOS ecosystem powering adaptive, emergent, permanent intelligence—SDKs, agents, RAG utilities, and deployment kits for enterprise AI teams.
          </p>
        </motion.div>

        {/* Quick Stats with real-time data */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {statsConfig.map((stat, i) => {
            const StatIcon = stat.icon
            const formatted = formatNumber(stat.value)
            const displayValue = formatted ?? (liveStats.loading ? '…' : '—')
            return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background-glass backdrop-blur-md rounded-xl p-6 border border-border-subtle text-center"
            >
              <StatIcon className="w-8 h-8 mx-auto mb-2 text-accent-primary" />
              <div className="text-2xl font-bold text-text-primary">{displayValue}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </motion.div>
          )})}
        </div>

        {/* Repository Grid by Category */}
        {Object.entries(categoryInfo).map(([category, info]) => {
          const categoryRepos = repositories.filter(r => r.category === category)
          if (categoryRepos.length === 0) return null

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${info.color}`} />
                <div>
                  <h3 className="text-2xl font-bold text-text-primary">{info.title}</h3>
                  <p className="text-sm text-text-muted">{info.description}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryRepos.map((repo, index) => (
                  <motion.a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-background-glass backdrop-blur-md rounded-xl p-6 border border-border-subtle hover:border-accent-primary transition-all duration-300 hover:shadow-neumorphic-hover"
                  >
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        repo.status === 'stable' ? 'bg-green-500/10 text-green-500' :
                        repo.status === 'beta' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-purple-500/10 text-purple-500'
                      }`}>
                        {repo.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${info.color} opacity-10 group-hover:opacity-20 transition-opacity`}>
                        <repo.icon className="w-6 h-6 text-accent-primary" />
                      </div>

                      <div className="flex-1">
                        <h4 className="font-semibold text-text-primary mb-1 flex items-center gap-2">
                          {repo.name}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h4>
                        <p className="text-sm text-text-muted line-clamp-2 mb-3">
                          {repo.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              {(() => {
                                const colorVars = ['var(--color-accent-primary)', 'var(--color-accent-secondary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)']
                                const dotColor = colorVars[index % colorVars.length]
                                return <div className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
                              })()}
                              {repo.language}
                            </span>
                          )}
                          {(() => {
                            const slug = repo.url.match(/github.com\/framersai\/([^/]+)/)?.[1]
                            const live = slug ? repoStats[slug] : undefined
                            const starsDisplay = live?.stars != null ? formatNumber(live.stars) : null
                            const updatedDisplay = live?.updatedAt
                              ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(live.updatedAt))
                              : repo.lastUpdated
                            return (
                              <>
                                {starsDisplay && (
                                  <span className="flex items-center gap-1">
                                    <Github className="w-3 h-3" />
                                    {starsDisplay} stars
                                  </span>
                                )}
                                {updatedDisplay && (
                                  <span>Updated {updatedDisplay}</span>
                                )}
                              </>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )
        })}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20"
        >
          <h3 className="text-2xl font-bold mb-3">Join the AgentOS Community</h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Contribute to open-source AI development, share your agents, and collaborate with developers worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/framersai"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-background-primary rounded-xl font-semibold border-2 border-accent-primary hover:bg-accent-primary/10 transition-all flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              Follow on GitHub
            </a>
            <a
              href="https://discord.gg/agentos"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-accent-primary dark:to-accent-secondary rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 border border-purple-500/20"
            >
              <Users className="w-5 h-5" />
              Join Discord Community
            </a>
            <a
              href="https://docs.agentos.sh/contributing"
              className="px-6 py-3 bg-background-glass backdrop-blur-md rounded-xl font-semibold border border-border-interactive hover:border-accent-primary transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="w-5 h-5" />
              Contribute Code
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}