'use client';

import { useState, useEffect } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Monitor, Sparkle, Scan, Sun, Leaf, Terminal } from 'lucide-react';
import { themes, ThemeName, applyTheme, getDefaultTheme } from '@/lib/themes';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';

const themeIcons: Record<ThemeName, LucideIcon> = {
  'sakura-sunset': Sparkle,
  'twilight-neo': Scan,
  'aurora-daybreak': Sun,
  'warm-embrace': Leaf,
  'retro-terminus': Terminal
};

/**
 * ThemeSelector renders the marketing theme palette picker, synchronising CSS variables with the active mode.
 */
export function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('aurora-daybreak');
  const [isOpen, setIsOpen] = useState(false);
  const { theme: mode, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const defaultTheme = getDefaultTheme();
    setCurrentTheme(defaultTheme);
  }, []);

  useEffect(() => {
    if (mounted) {
      const actualMode = mode === 'system' ? systemTheme : mode;
      const isDark = actualMode === 'dark';
      applyTheme(currentTheme, isDark);
    }
  }, [mode, systemTheme, currentTheme, mounted]);

  const handleThemeChange = (themeName: ThemeName) => {
    setCurrentTheme(themeName);
    const actualMode = mode === 'system' ? systemTheme : mode;
    const isDark = actualMode === 'dark';
    applyTheme(themeName, isDark);
    setIsOpen(false);
  };

  const renderIcon = (themeName: ThemeName, className: string) => {
    const Icon = themeIcons[themeName];
    return Icon ? <Icon className={className} aria-hidden="true" /> : null;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-white hover:shadow-md dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800"
        aria-label="Select theme"
      >
        {renderIcon(currentTheme, 'h-4 w-4 text-brand')}
        <span className="hidden sm:inline">{themes[currentTheme].name}</span>
        <span className="sm:hidden text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          {themes[currentTheme].descriptor}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute right-0 top-full z-40 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="p-2">
                {Object.entries(themes).map(([key, theme]) => {
                  const themeName = key as ThemeName;
                  const isActive = currentTheme === themeName;
                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange(themeName)}
                      className={`group flex w-full items-start gap-3 rounded-lg p-3 text-left transition ${
                        isActive ? 'bg-brand/10 text-brand' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {renderIcon(
                        themeName,
                        `h-5 w-5 ${
                          isActive ? 'text-brand' : 'text-slate-400 dark:text-slate-500 group-hover:text-brand'
                        }`
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-white">{theme.name}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{theme.description}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {theme.descriptor}
                          </span>
                          {isActive && (
                            <span className="rounded-full bg-brand/20 px-2 py-0.5 text-xs font-medium text-brand">
                              Active
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div
                          className="h-3 w-3 rounded-full border border-slate-300 dark:border-slate-600"
                          style={{ backgroundColor: theme.light.accent.primary }}
                          aria-hidden="true"
                        />
                        <div
                          className="h-3 w-3 rounded-full border border-slate-300 dark:border-slate-600"
                          style={{ backgroundColor: theme.light.accent.secondary }}
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Monitor className="h-3 w-3" />
                  <span>Themes adapt to your system preference</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
