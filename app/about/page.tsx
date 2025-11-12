import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Github, Linkedin, Twitter, Globe, ExternalLink } from 'lucide-react'
import { AnimatedAgentOSLogo } from '../../components/icons/animated-logo'

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <AnimatedAgentOSLogo />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-accent-primary dark:to-accent-secondary bg-clip-text text-transparent"
          >
            About AgentOS
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700 dark:text-text-secondary leading-relaxed"
          >
            AgentOS is an open-source TypeScript runtime for building adaptive AI agent systems. 
            Built by <Link href="https://frame.dev" className="text-purple-600 dark:text-accent-primary hover:underline font-semibold">Frame.dev</Link>, 
            AgentOS powers intelligent applications with GMI orchestration, persistent memory, and enterprise-grade guardrails.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-lg text-gray-700 dark:text-text-secondary mb-4 leading-relaxed">
              We’re building the most advanced AI agent runtime for developers who want to create intelligent, 
              adaptive systems without compromising on control, safety, or performance.
            </p>
            <p className="text-lg text-gray-700 dark:text-text-secondary leading-relaxed">
              AgentOS combines cutting-edge AI orchestration with production-ready infrastructure, enabling 
              developers to build everything from simple chatbots to complex multi-agent systems with 
              <span className="font-semibold text-purple-600 dark:text-accent-primary"> OpenStrand</span> memory architecture.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">The Team</h2>
            <p className="text-lg text-gray-700 dark:text-text-secondary leading-relaxed">
              AgentOS is developed by the team at <Link href="https://frame.dev" className="text-purple-600 dark:text-accent-primary hover:underline font-semibold">Frame.dev</Link>, 
              a company focused on building the future of AI-powered development tools. We’re a distributed team of 
              engineers, designers, and AI researchers passionate about making advanced AI accessible to all developers.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-morphism rounded-2xl p-6 border border-purple-200/30 dark:border-purple-500/20"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">General Inquiries</h3>
              <a 
                href="mailto:team@frame.dev" 
                className="flex items-center gap-3 text-purple-600 dark:text-accent-primary hover:underline font-medium"
              >
                <Mail className="w-5 h-5" />
                team@frame.dev
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-morphism rounded-2xl p-6 border border-purple-200/30 dark:border-purple-500/20"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Enterprise & Support</h3>
              <a 
                href="mailto:team@frame.dev" 
                className="flex items-center gap-3 text-purple-600 dark:text-accent-primary hover:underline font-medium"
              >
                <Mail className="w-5 h-5" />
                team@frame.dev
              </a>
              <p className="text-sm text-gray-600 dark:text-text-muted mt-2">
                For production deployments, enterprise licensing, and dedicated support
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Connect With Us</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="https://github.com/framersai"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-morphism rounded-xl p-6 hover:shadow-lg transition-all group border border-purple-200/30 dark:border-purple-500/20"
              >
                <Github className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-accent-primary group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">GitHub</div>
                <div className="text-xs text-gray-600 dark:text-text-muted">@framersai</div>
              </a>

              <a
                href="https://www.linkedin.com/company/framersai"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-morphism rounded-xl p-6 hover:shadow-lg transition-all group border border-purple-200/30 dark:border-purple-500/20"
              >
                <Linkedin className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-accent-primary group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">LinkedIn</div>
                <div className="text-xs text-gray-600 dark:text-text-muted">FramersAI</div>
              </a>

              <a
                href="https://twitter.com/framersai"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-morphism rounded-xl p-6 hover:shadow-lg transition-all group border border-purple-200/30 dark:border-purple-500/20"
              >
                <Twitter className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-accent-primary group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Twitter</div>
                <div className="text-xs text-gray-600 dark:text-text-muted">@framersai</div>
              </a>

              <a
                href="https://frame.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-morphism rounded-xl p-6 hover:shadow-lg transition-all group border border-purple-200/30 dark:border-purple-500/20"
              >
                <Globe className="w-8 h-8 mx-auto mb-3 text-purple-600 dark:text-accent-primary group-hover:scale-110 transition-transform" />
                <div className="text-sm font-semibold text-gray-900 dark:text-white">Frame.dev</div>
                <div className="text-xs text-gray-600 dark:text-text-muted">Our Company</div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* License Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-morphism rounded-2xl p-8 border border-purple-200/30 dark:border-purple-500/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Open Source Licensing</h2>
            <div className="space-y-4 text-gray-700 dark:text-text-secondary">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">AgentOS Core Engine</h3>
                <p className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono text-sm">
                    Apache 2.0
                  </span>
                  The core AgentOS runtime, GMI orchestration, and infrastructure
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Extensions & Agents</h3>
                <p className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono text-sm">
                    MIT
                  </span>
                  Community-built agents, extensions, and guardrails
                </p>
              </div>
              <p className="text-sm mt-6">
                We believe in open source. AgentOS is free to use, modify, and distribute. 
                For enterprise support and production deployments, contact us at{' '}
                <a href="mailto:team@frame.dev" className="text-purple-600 dark:text-accent-primary hover:underline font-semibold">
                  team@frame.dev
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Ready to Build?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://github.com/framersai/agentos"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-accent-primary dark:to-accent-secondary text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all border border-purple-500/20"
              >
                <Github className="w-5 h-5" />
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 glass-morphism rounded-xl font-semibold text-gray-700 dark:text-white hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-all border border-purple-200/30 dark:border-purple-500/20"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

