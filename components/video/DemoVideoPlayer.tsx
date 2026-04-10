'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DemoVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
}

function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}

function getDemoVideos(t: ReturnType<typeof useTranslations>): DemoVideo[] {
  return [
    {
      id: 'agent-loop',
      title: t('videos.agentLoop.title'),
      description: t('videos.agentLoop.description'),
      youtubeId: 'Iz0Kcz1vqcw',
    },
    {
      id: 'multi-agent',
      title: t('videos.multiAgent.title'),
      description: t('videos.multiAgent.description'),
      youtubeId: 'LUhlNjOoRFY',
    },
    {
      id: 'graph-pipeline',
      title: t('videos.graphPipeline.title'),
      description: t('videos.graphPipeline.description'),
      youtubeId: 'bQ71bOLiVIc',
    },
    {
      id: 'tool-forge',
      title: t('videos.toolForge.title'),
      description: t('videos.toolForge.description'),
      youtubeId: 'sfccCkIRDpk',
    },
  ];
}

export function DemoVideoPlayer() {
  const t = useTranslations('videoDemo');
  const DEMO_VIDEOS = getDemoVideos(t);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const activeVideo = DEMO_VIDEOS[activeIndex];

  // Lazy load iframe only when section is visible
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goToPrevious = () => {
    setActiveIndex(i => (i - 1 + DEMO_VIDEOS.length) % DEMO_VIDEOS.length);
  };

  const goToNext = () => {
    setActiveIndex(i => (i + 1) % DEMO_VIDEOS.length);
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[var(--color-background)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            {t('title')}
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* YouTube Embed */}
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10">
            {isVisible ? (
              <iframe
                key={activeVideo.youtubeId}
                src={getYouTubeEmbedUrl(activeVideo.youtubeId)}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                className="w-full h-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-violet-950/20 to-slate-900">
                <h3 className="text-xl font-semibold text-white mb-2">{activeVideo.title}</h3>
                <p className="text-slate-400 text-sm">{activeVideo.description}</p>
              </div>
            )}
          </div>

          {/* Video Selector */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-[var(--color-background-tertiary)] rounded-full transition-colors"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
            </button>

            <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
              {DEMO_VIDEOS.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => setActiveIndex(index)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    index === activeIndex
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                      : 'bg-[var(--color-background-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-background-tertiary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {video.title}
                </button>
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 hover:bg-[var(--color-background-tertiary)] rounded-full transition-colors"
              aria-label="Next video"
            >
              <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoVideoPlayer;
