'use client'

import { motion } from 'framer-motion'
import {
  Github, ExternalLink, Package, Shield, Mic, Store, FileCode2,
  Puzzle, Database, Globe, Users, BookOpen, Zap, Lock, Cloud,
  Terminal, Layers, Settings, Brain, Code2, GitBranch
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
    description: 'Universal SQL storage for cross-platform builds with smart fallbacks and syncing.',
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
  },
  {
    name: '.github',
    description: 'Community health files and GitHub configuration for all Frame repositories.',
    url: 'https://github.com/framersai/.github',
    category: 'infrastructure',
    icon: Settings,
    status: 'stable',
    lastUpdated: '2 minutes ago'
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
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            The AgentOS Ecosystem
          </h2>
          <p className="text-lg text-text-muted max-w-3xl mx-auto">
            Explore our comprehensive suite of open-source tools, frameworks, and applications
            for building next-generation AI systems
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Repositories', value: '22', icon: GitBranch },
            { label: 'Contributors', value: '150+', icon: Users },
            { label: 'Weekly Downloads', value: '25K+', icon: Package },
            { label: 'GitHub Stars', value: '5K+', icon: Github }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-background-glass backdrop-blur-md rounded-xl p-6 border border-border-subtle text-center"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-accent-primary" />
              <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
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

                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          {repo.language && (
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-accent-primary" />
                              {repo.language}
                            </span>
                          )}
                          {repo.lastUpdated && (
                            <span>Updated {repo.lastUpdated}</span>
                          )}
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
              className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-semibold text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
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