'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Download, TrendingUp, DollarSign, Users, ArrowRight, Sparkle } from 'lucide-react';

interface MarketplaceAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: {
    type: 'free' | 'paid' | 'freemium';
    price?: number;
    currency?: string;
    label?: string;
  };
  author: string;
  rating?: number;
  downloads?: number;
  revenue?: string;
  personaId?: string;
}

const FALLBACK_AGENTS: MarketplaceAgent[] = [
  {
    id: 'atlas-architect',
    name: 'Atlas Systems Architect',
    description: 'Enterprise-grade system design and code review with deep technical expertise',
    category: 'Developer Tools',
    pricing: { type: 'paid', price: 49, currency: 'USD' },
    author: 'Frame.dev',
    rating: 4.9,
    downloads: 1250,
    revenue: '$2,450/mo'
  },
  {
    id: 'creative-muse',
    name: 'Creative Muse',
    description: 'AI-powered creative writing and ideation assistant for content creators',
    category: 'Creative',
    pricing: { type: 'freemium' },
    author: 'Community',
    rating: 4.7,
    downloads: 3400
  },
  {
    id: 'data-analyst-pro',
    name: 'Data Analyst Pro',
    description: 'Advanced data analysis, visualization, and insights generation',
    category: 'Analytics',
    pricing: { type: 'paid', price: 99, currency: 'USD' },
    author: 'DataCraft',
    rating: 4.8,
    downloads: 890,
    revenue: '$8,900/mo'
  },
  {
    id: 'language-tutor',
    name: 'Polyglot Language Tutor',
    description: 'Adaptive language learning with conversation practice in 20+ languages',
    category: 'Education',
    pricing: { type: 'freemium' },
    author: 'EduTech Labs',
    rating: 4.9,
    downloads: 5600,
    revenue: '$4,200/mo'
  },
  {
    id: 'sales-assistant',
    name: 'Sales Accelerator',
    description: 'CRM integration, lead qualification, and automated follow-ups',
    category: 'Business',
    pricing: { type: 'paid', price: 79, currency: 'USD' },
    author: 'SalesForce AI',
    rating: 4.6,
    downloads: 2100,
    revenue: '$12,400/mo'
  },
  {
    id: 'wellness-coach',
    name: 'Wellness Coach AI',
    description: 'Personalized health, fitness, and mental wellness guidance',
    category: 'Health',
    pricing: { type: 'free' },
    author: 'HealthTech',
    rating: 4.8,
    downloads: 8900
  }
];

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api').replace(/\/$/, '');

interface MarketplaceAgentSummaryResponse {
  id: string;
  personaId: string;
  label: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  pricing: {
    model: 'free' | 'paid' | 'freemium' | null;
    priceCents: number | null;
    currency: string | null;
  };
  metrics?: {
    downloads?: number;
    rating?: number;
    revenueMonthlyUsd?: number;
    customers?: number;
  };
}

const marketplaceStats = [
  { value: '70%', label: 'Revenue share' },
  { value: '$10k+', label: 'Top creator monthly' },
  { value: 'Free', label: 'Tier available' },
  { value: 'Global', label: 'Marketplace reach' }
];

const marketplaceSignals = [
  { icon: Users, text: '10,000+ developers' },
  { icon: TrendingUp, text: '50% MoM growth' },
  { icon: Star, text: '4.8 avg rating' }
];

const avatarGradients = [
  'from-rose-500/20 via-rose-400/10 to-purple-500/20 text-rose-600',
  'from-sky-500/20 via-sky-400/10 to-cyan-500/20 text-sky-600',
  'from-amber-500/20 via-orange-400/10 to-amber-500/20 text-amber-600',
  'from-emerald-500/20 via-teal-400/10 to-emerald-500/20 text-emerald-600',
  'from-purple-500/20 via-violet-400/10 to-purple-500/20 text-purple-600',
  'from-slate-500/20 via-slate-400/10 to-slate-500/20 text-slate-600'
];

function mapMarketplaceAgent(agent: MarketplaceAgentSummaryResponse): MarketplaceAgent {
  const pricingModel = (agent.pricing?.model ?? 'freemium') as 'free' | 'paid' | 'freemium';
  const price =
    typeof agent.pricing?.priceCents === 'number' ? agent.pricing.priceCents / 100 : undefined;
  const pricingLabel =
    pricingModel === 'paid' && typeof price === 'number'
      ? new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: agent.pricing?.currency ?? 'USD',
          minimumFractionDigits: 0,
        }).format(price) + '/mo'
      : undefined;

  const metrics = agent.metrics ?? {};

  return {
    id: agent.id,
    personaId: agent.personaId,
    name: agent.label,
    description: agent.tagline ?? agent.description ?? agent.label,
    category: agent.category ?? 'General',
    pricing: {
      type: pricingModel,
      price,
      currency: agent.pricing?.currency ?? 'USD',
      label: pricingLabel,
    },
    author: 'Frame.dev',
    rating: typeof metrics.rating === 'number' ? metrics.rating : undefined,
    downloads: typeof metrics.downloads === 'number' ? metrics.downloads : undefined,
    revenue:
      typeof metrics.revenueMonthlyUsd === 'number'
        ? `$${metrics.revenueMonthlyUsd.toLocaleString()}/mo`
        : undefined,
  };
}

function AgentAvatar({ name, index }: { name: string; index: number }) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const gradientClass = avatarGradients[index % avatarGradients.length];

  return (
    <div className={`marketplace-avatar ${gradientClass}`}>
      {initials || 'AI'}
    </div>
  );
}

function AgentCard({ agent, index }: { agent: MarketplaceAgent; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative glass-panel flex flex-col transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <AgentAvatar name={agent.name} index={index} />
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">{agent.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">by {agent.author}</p>
          </div>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {agent.category}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 flex-1 text-sm text-slate-600 dark:text-slate-300">{agent.description}</p>

      {/* Revenue chip */}
      {agent.revenue && (
        <div className="mt-3">
          <span className="marketplace-chip">
            <span className="marketplace-chip__value">{agent.revenue}</span>
            <span className="marketplace-chip__label">Creator earnings</span>
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 border-t border-slate-200/50 pt-4 text-xs dark:border-slate-700/50">
        {agent.rating !== undefined && (
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
            <span className="font-medium">{agent.rating.toFixed(1)}</span>
          </div>
        )}
        {agent.downloads !== undefined && (
          <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
            <Download className="h-3 w-3" />
            <span>{agent.downloads.toLocaleString()}</span>
          </div>
        )}
        <div className="ml-auto">
          {agent.pricing.type === 'free' && (
            <span className="marketplace-badge marketplace-badge--free">
              {agent.pricing.label ?? 'Free'}
            </span>
          )}
          {agent.pricing.type === 'paid' && (
            <span className="marketplace-badge marketplace-badge--paid">
              {agent.pricing.label ??
                (agent.pricing.price
                  ? new Intl.NumberFormat(undefined, {
                      style: 'currency',
                      currency: agent.pricing.currency ?? 'USD',
                      minimumFractionDigits: 0,
                    }).format(agent.pricing.price)
                  : 'Paid')}
            </span>
          )}
          {agent.pricing.type === 'freemium' && (
            <span className="marketplace-badge marketplace-badge--freemium">
              {agent.pricing.label ?? 'Freemium'}
            </span>
          )}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-brand/5 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        <a
          href="https://vca.chat"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
        >
          View in marketplace
        </a>
      </div>
    </motion.div>
  );
}

const SKELETON_CARD_COUNT = 6;

export function MarketplacePreview() {
  const [agents, setAgents] = useState<MarketplaceAgent[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const loadAgents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/marketplace/agents`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Marketplace request failed with status ${response.status}`);
        }
        const payload = await response.json();
        if (!cancelled && Array.isArray(payload?.agents)) {
          const mapped = payload.agents.map(mapMarketplaceAgent);
          setAgents(mapped.length ? mapped : FALLBACK_AGENTS);
        }
      } catch (error) {
        if (!cancelled) {
          console.warn('[MarketplacePreview] Falling back to static marketplace data.', error);
          setAgents(FALLBACK_AGENTS);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadAgents();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const showSkeleton = (agents === null && isLoading) || (!agents && isLoading);
  const displayAgents = agents ?? FALLBACK_AGENTS;

  return (
    <div className="space-y-12">
      {/* Build and Earn CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="marketplace-cta glass-panel p-8 md:p-10"
      >
        <div className="marketplace-cta__row">
          <div className="marketplace-cta__eyebrow">
            <span className="marketplace-cta__icon">
              <DollarSign className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="marketplace-cta__badge">Monetize your expertise</span>
          </div>
          <div>
            <h2 className="marketplace-cta__headline">Turn your AI expertise into revenue</h2>
            <p className="marketplace-cta__subhead">
              Create agents, set your price, and earn from every sale. Join thousands of developers building the future of AI.
            </p>
          </div>
        </div>

        <div className="marketplace-cta__stats">
          {marketplaceStats.map((stat) => (
            <div key={stat.label} className="marketplace-chip">
              <span className="marketplace-chip__value">{stat.value}</span>
              <span className="marketplace-chip__label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="marketplace-cta__actions">
          <a
            href="https://vca.chat"
            target="_blank"
            rel="noopener noreferrer"
            className="marketplace-cta__button marketplace-cta__button--primary"
          >
            <Sparkle className="h-5 w-5" aria-hidden="true" />
            Start selling on VCA.chat
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="https://app.vca.chat/en"
            target="_blank"
            rel="noopener noreferrer"
            className="marketplace-cta__button marketplace-cta__button--outline"
          >
            Try demo first
          </a>
        </div>

        <div className="marketplace-cta__signals">
          {marketplaceSignals.map((signal) => (
            <div key={signal.text} className="marketplace-cta__signal">
              <signal.icon className="h-4 w-4" aria-hidden="true" />
              <span>{signal.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Featured Agents Grid */}
      <div>
        <div className="marketplace-featured__intro text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Featured agents in the marketplace</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Discover pre-built agents ready to deploy, or create your own and start earning.
          </p>
        </div>

        {showSkeleton ? (
          <div className="marketplace-card-grid marketplace-card-grid--skeleton">
            {Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
              <div key={`marketplace-skeleton-${index}`} className="marketplace-card-skeleton">
                <div className="marketplace-card-skeleton__header">
                  <div className="marketplace-card-skeleton__avatar marketplace-shimmer" />
                  <div className="marketplace-card-skeleton__title">
                    <div className="marketplace-card-skeleton__line marketplace-card-skeleton__line--short marketplace-shimmer" />
                    <div className="marketplace-card-skeleton__line marketplace-card-skeleton__line--xs marketplace-shimmer" />
                  </div>
                </div>
                <div className="marketplace-card-skeleton__line marketplace-card-skeleton__line--full marketplace-shimmer" />
                <div className="marketplace-card-skeleton__line marketplace-card-skeleton__line--medium marketplace-shimmer" />
                <div className="marketplace-card-skeleton__chips">
                  <span className="marketplace-card-skeleton__chip marketplace-shimmer" />
                  <span className="marketplace-card-skeleton__chip marketplace-shimmer" />
                  <span className="marketplace-card-skeleton__chip marketplace-shimmer" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayAgents.map((agent, index) => (
              <AgentCard key={agent.id} agent={agent} index={index} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="https://vca.chat"
            target="_blank"
            rel="noopener noreferrer"
            className="marketplace-cta__button marketplace-cta__button--primary inline-flex items-center justify-center"
          >
            Browse all agents
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
