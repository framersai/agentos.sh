'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Mail, Github, MessageCircle, Sparkles } from 'lucide-react'
import { useState } from 'react'

export function CTASection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')

    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/10 via-transparent to-accent-secondary/10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-primary/20 rounded-full filter blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-secondary/20 rounded-full filter blur-3xl animate-float-reverse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 backdrop-blur-sm border border-accent-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-accent-primary" />
            <span className="text-sm font-medium bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Join the AI Revolution
            </span>
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              Ready to Build with AgentOS?
            </span>
          </h2>

          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-12">
            AgentOS is open source and MIT licensed. Join the early access list to collaborate
            with the Frame team, migrate your existing assistant, and shape the roadmap.
          </p>
        </motion.div>

        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-background-glass backdrop-blur-md rounded-3xl p-8 md:p-12 border border-accent-primary/20 shadow-neumorphic">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                  Email address
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@team.dev"
                    className="flex-1 px-4 py-3 bg-background-primary rounded-xl border border-border-subtle focus:border-accent-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 transition-all"
                    required
                    disabled={status === 'loading'}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-8 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <span>Requesting...</span>
                    ) : status === 'success' ? (
                      <>
                        <span>Success!</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Request Access</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-green-500"
                >
                  Thank you! We'll be in touch soon.
                </motion.p>
              )}

              <p className="text-xs text-text-muted">
                By subscribing you agree to receive product updates from Frame.dev.
                No spam, pinky promise.
              </p>
            </form>

            <div className="mt-8 pt-8 border-t border-border-subtle">
              <p className="text-sm text-text-secondary text-center mb-6">
                Or explore AgentOS today:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <a
                  href="https://vca.chat"
                  className="group flex items-center justify-center gap-2 px-4 py-3 bg-background-primary rounded-xl border border-border-subtle hover:border-accent-primary transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-accent-primary" />
                  <span className="text-sm font-medium">Try Voice Chat</span>
                </a>

                <a
                  href="https://github.com/framersai/agentos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 px-4 py-3 bg-background-primary rounded-xl border border-border-subtle hover:border-accent-primary transition-all"
                >
                  <Github className="w-4 h-4 text-accent-primary" />
                  <span className="text-sm font-medium">Browse Code</span>
                </a>

                <a
                  href="https://marketplace.agentos.sh"
                  className="group flex items-center justify-center gap-2 px-4 py-3 bg-background-primary rounded-xl border border-border-subtle hover:border-accent-primary transition-all"
                >
                  <Sparkles className="w-4 h-4 text-accent-primary" />
                  <span className="text-sm font-medium">Marketplace</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="font-semibold mb-2">Documentation</h3>
            <p className="text-sm text-text-muted mb-4">
              Comprehensive guides and API references
            </p>
            <a
              href="https://docs.agentos.sh"
              className="text-sm font-medium text-accent-primary hover:text-accent-hover"
            >
              Read the docs →
            </a>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="font-semibold mb-2">Community</h3>
            <p className="text-sm text-text-muted mb-4">
              Join discussions and get help from experts
            </p>
            <a
              href="https://discord.gg/agentos"
              className="text-sm font-medium text-accent-primary hover:text-accent-hover"
            >
              Join Discord →
            </a>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold mb-2">Enterprise</h3>
            <p className="text-sm text-text-muted mb-4">
              Custom deployment and support options
            </p>
            <a
              href="mailto:enterprise@frame.dev"
              className="text-sm font-medium text-accent-primary hover:text-accent-hover"
            >
              Contact sales →
            </a>
          </div>
        </motion.div>

        {/* Footer Attribution */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-text-muted">
            A product by{' '}
            <a
              href="https://frame.dev"
              className="font-medium text-accent-primary hover:text-accent-hover"
            >
              Frame.dev
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}