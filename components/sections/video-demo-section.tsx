'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Maximize2, X, Monitor, Smartphone, Code2 } from 'lucide-react'

interface Demo {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl?: string
  gifUrl?: string
  category: 'getting-started' | 'features' | 'integrations'
}

const demos: Demo[] = [
  {
    id: 'quick-start',
    title: 'Quick Start Guide',
    description: 'Get up and running with AgentOS in under 5 minutes',
    thumbnail: '/media/demos/quick-start-thumb.jpg',
    videoUrl: '/media/demos/quick-start.mp4',
    gifUrl: '/media/demos/quick-start.gif',
    category: 'getting-started'
  },
  {
    id: 'vca-demo',
    title: 'Voice Chat Assistant',
    description: 'Build a voice-enabled AI assistant with real-time responses',
    thumbnail: '/media/demos/vca-thumb.jpg',
    videoUrl: '/media/demos/vca-demo.mp4',
    category: 'features'
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Orchestration',
    description: 'Coordinate multiple AI agents working together',
    thumbnail: '/media/demos/multi-agent-thumb.jpg',
    gifUrl: '/media/demos/multi-agent.gif',
    category: 'features'
  },
  {
    id: 'memory-system',
    title: 'Persistent Memory',
    description: 'How AgentOS handles long-term memory and context',
    thumbnail: '/media/demos/memory-thumb.jpg',
    videoUrl: '/media/demos/memory-system.mp4',
    category: 'features'
  },
  {
    id: 'tool-integration',
    title: 'Tool Integration',
    description: 'Connect external APIs and services to your agents',
    thumbnail: '/media/demos/tools-thumb.jpg',
    gifUrl: '/media/demos/tools.gif',
    category: 'integrations'
  },
  {
    id: 'deployment',
    title: 'Deploy to Production',
    description: 'Deploy your AgentOS applications at scale',
    thumbnail: '/media/demos/deploy-thumb.jpg',
    videoUrl: '/media/demos/deployment.mp4',
    category: 'getting-started'
  }
]

export function VideoDemoSection() {
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null)
  const [activeCategory, setActiveCategory] = useState<'all' | Demo['category']>('all')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const filteredDemos = activeCategory === 'all'
    ? demos
    : demos.filter(d => d.category === activeCategory)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            See AgentOS in Action
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Watch interactive demos and tutorials to understand the power of adaptive AI agents
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex gap-2 p-1 bg-background-glass backdrop-blur-md rounded-xl border border-border-subtle">
            {[
              { value: 'all', label: 'All Demos' },
              { value: 'getting-started', label: 'Getting Started' },
              { value: 'features', label: 'Features' },
              { value: 'integrations', label: 'Integrations' }
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value as any)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === tab.value
                    ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredDemos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-background-glass backdrop-blur-md border border-border-subtle hover:border-accent-primary transition-all duration-300 shadow-neumorphic hover:shadow-neumorphic-hover"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10">
                {demo.thumbnail ? (
                  <img
                    src={demo.thumbnail}
                    alt={demo.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Monitor className="w-12 h-12 text-text-muted opacity-50" />
                  </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedDemo(demo)}
                    className="p-4 bg-white/90 rounded-full shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 text-accent-primary ml-1" fill="currentColor" />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 bg-background-primary/80 backdrop-blur-sm rounded-full text-xs font-medium text-text-secondary">
                    {demo.category.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 text-text-primary group-hover:text-accent-primary transition-colors">
                  {demo.title}
                </h3>
                <p className="text-sm text-text-muted line-clamp-2">
                  {demo.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Large Featured Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5 border border-accent-primary/20 p-8"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                Build Your First Agent
              </h3>
              <p className="text-lg text-text-secondary mb-6">
                Follow our comprehensive tutorial to create your first intelligent agent with AgentOS.
                Learn about GMI roles, memory systems, tool integration, and deployment strategies.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-background-glass backdrop-blur-sm rounded-lg text-sm font-medium">
                  15 min tutorial
                </span>
                <span className="px-4 py-2 bg-background-glass backdrop-blur-sm rounded-lg text-sm font-medium">
                  Beginner friendly
                </span>
                <span className="px-4 py-2 bg-background-glass backdrop-blur-sm rounded-lg text-sm font-medium">
                  Full code examples
                </span>
              </div>
              <button
                onClick={() => setSelectedDemo(demos[0])}
                className="px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Watch Tutorial
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <Play className="w-12 h-12 text-white ml-2" fill="currentColor" />
                  </div>
                  <p className="text-white font-medium">Featured Tutorial</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal */}
      {selectedDemo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md ${
            isFullscreen ? '' : ''
          }`}
          onClick={() => setSelectedDemo(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className={`relative bg-background-primary rounded-2xl overflow-hidden shadow-2xl ${
              isFullscreen ? 'w-full h-full' : 'max-w-5xl w-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-primary">
              <h3 className="text-xl font-semibold">{selectedDemo.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedDemo(null)}
                  className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Content */}
            <div className={`relative bg-black ${isFullscreen ? 'h-[calc(100%-4rem)]' : 'aspect-video'}`}>
              {selectedDemo.videoUrl ? (
                <video
                  src={selectedDemo.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : selectedDemo.gifUrl ? (
                <img
                  src={selectedDemo.gifUrl}
                  alt={selectedDemo.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted">
                  <div className="text-center">
                    <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Demo video coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}