'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type: _type = 'success', isVisible, onClose, duration = 1500 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-background-secondary,#1e1b4b)] text-[var(--color-text-primary,#e0e7ff)] text-xs font-medium shadow-lg border border-[var(--color-accent-primary,#6366f1)]/20 backdrop-blur-sm">
            <Check className="w-3 h-3 text-green-400" />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast;
