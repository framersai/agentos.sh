'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';

interface Caption {
  start: number;
  end: number;
  text: string;
}

interface DemoVideo {
  id: string;
  title: string;
  description: string;
  src: string;
  poster?: string;
  captions?: Caption[];
  duration?: number;
}

/**
 * Build video definitions with translated strings from the videoDemo namespace.
 * Each video's title, description, and captions are pulled from the locale files.
 */
function getDemoVideos(t: ReturnType<typeof useTranslations>): DemoVideo[] {
  return [
    {
      id: 'streaming',
      title: t('videos.streaming.title'),
      description: t('videos.streaming.description'),
      src: '/videos/streaming.mp4',
      captions: [
        { start: 0.5, end: 3, text: t('videos.streaming.captions.0') },
        { start: 3.5, end: 7, text: t('videos.streaming.captions.1') },
        { start: 7.5, end: 10, text: t('videos.streaming.captions.2') },
      ]
    },
    {
      id: 'agent-creation',
      title: t('videos.agentCreation.title'),
      description: t('videos.agentCreation.description'),
      src: '/videos/agent-creation.mp4',
      captions: [
        { start: 0.5, end: 3.5, text: t('videos.agentCreation.captions.0') },
        { start: 4, end: 7, text: t('videos.agentCreation.captions.1') },
        { start: 7.5, end: 11, text: t('videos.agentCreation.captions.2') },
        { start: 11.5, end: 15.5, text: t('videos.agentCreation.captions.3') },
        { start: 16, end: 19, text: t('videos.agentCreation.captions.4') },
        { start: 19.5, end: 25, text: t('videos.agentCreation.captions.5') },
      ]
    },
    {
      id: 'multi-agent',
      title: t('videos.multiAgent.title'),
      description: t('videos.multiAgent.description'),
      src: '/videos/multi-agent.mp4',
      captions: [
        { start: 0.5, end: 4, text: t('videos.multiAgent.captions.0') },
        { start: 4.5, end: 8, text: t('videos.multiAgent.captions.1') },
        { start: 8.5, end: 13, text: t('videos.multiAgent.captions.2') },
      ]
    },
    {
      id: 'rag-memory',
      title: t('videos.ragMemory.title'),
      description: t('videos.ragMemory.description'),
      src: '/videos/rag-memory.mp4',
      captions: [
        { start: 0.5, end: 4, text: t('videos.ragMemory.captions.0') },
        { start: 4.5, end: 8, text: t('videos.ragMemory.captions.1') },
        { start: 8.5, end: 12, text: t('videos.ragMemory.captions.2') },
      ]
    },
    {
      id: 'planning-engine',
      title: t('videos.planningEngine.title'),
      description: t('videos.planningEngine.description'),
      src: '/videos/planning-engine.mp4',
      captions: [
        { start: 0.5, end: 4, text: t('videos.planningEngine.captions.0') },
        { start: 4.5, end: 7, text: t('videos.planningEngine.captions.1') },
        { start: 7.5, end: 10, text: t('videos.planningEngine.captions.2') },
      ]
    }
  ];
}

function VideoControls({
  isPlaying,
  isMuted,
  progress,
  duration,
  currentTime,
  onPlayPause,
  onMute,
  onSeek,
  onFullscreen,
  onSkipBack,
  onSkipForward
}: {
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  onPlayPause: () => void;
  onMute: () => void;
  onSeek: (value: number) => void;
  onFullscreen: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
}) {
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {/* Progress bar */}
      <div className="relative h-1 bg-white/20 rounded-full mb-3 cursor-pointer group/progress"
           onClick={(e) => {
             const rect = e.currentTarget.getBoundingClientRect();
             const percent = (e.clientX - rect.left) / rect.width;
             onSeek(percent * duration);
           }}>
        <div
          className="absolute h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"
          style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onSkipBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <SkipBack className="w-4 h-4 text-white" />
          </button>
          <button onClick={onPlayPause} className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </button>
          <button onClick={onSkipForward} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <SkipForward className="w-4 h-4 text-white" />
          </button>
          <span className="text-white/70 text-sm font-mono ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onMute} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
          </button>
          <button onClick={onFullscreen} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <Maximize className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DemoVideoPlayer() {
  const t = useTranslations('videoDemo');
  const DEMO_VIDEOS = getDemoVideos(t);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentCaption, setCurrentCaption] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const activeVideo = DEMO_VIDEOS[activeIndex];

  // Lazy load video only when section is visible
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only need to load once
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Load video source when visible
  useEffect(() => {
    if (isVisible && videoRef.current && !videoLoaded) {
      videoRef.current.load();
      setVideoLoaded(true);
    }
  }, [isVisible, videoLoaded]);

  // Update captions based on current time
  useEffect(() => {
    if (!activeVideo.captions) return;

    const caption = activeVideo.captions.find(
      c => currentTime >= c.start && currentTime < c.end
    );
    setCurrentCaption(caption?.text || null);
  }, [currentTime, activeVideo]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setCurrentTime(current);
    setProgress((current / total) * 100);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVideoError(false);
    }
  }, []);

  const handleError = useCallback(() => {
    setVideoError(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  }, []);

  const skipBack = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  }, []);

  const skipForward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
    }
  }, [duration]);

  const goToPrevious = useCallback(() => {
    setActiveIndex(i => (i - 1 + DEMO_VIDEOS.length) % DEMO_VIDEOS.length);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [DEMO_VIDEOS.length]);

  const goToNext = useCallback(() => {
    setActiveIndex(i => (i + 1) % DEMO_VIDEOS.length);
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [DEMO_VIDEOS.length]);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-[var(--color-background)]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">
            {t('badge')}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
            {t('title')}
          </h2>
          <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Video Player */}
        <div className="max-w-5xl mx-auto">
          <div
            ref={containerRef}
            className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl shadow-violet-500/10 group"
          >
            {videoError ? (
              /* Placeholder when video not available */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-violet-950/20 to-slate-900">
                <div className="w-20 h-20 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-4">
                  <Play className="w-10 h-10 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{activeVideo.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{activeVideo.description}</p>
                <p className="text-xs text-slate-500">{t('comingSoon')}</p>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={isVisible ? activeVideo.src : undefined}
                  poster={activeVideo.poster}
                  muted={isMuted}
                  preload={isVisible ? 'metadata' : 'none'}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onError={handleError}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                  playsInline
                />

                {/* Caption Overlay */}
                {currentCaption && (
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none">
                    <div className="px-6 py-3 bg-black/80 backdrop-blur-sm rounded-xl text-white text-lg font-medium shadow-xl">
                      {currentCaption}
                    </div>
                  </div>
                )}

                {/* Play button overlay */}
                {!isPlaying && (
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                  </button>
                )}

                {/* Controls */}
                <VideoControls
                  isPlaying={isPlaying}
                  isMuted={isMuted}
                  progress={progress}
                  duration={duration}
                  currentTime={currentTime}
                  onPlayPause={togglePlay}
                  onMute={toggleMute}
                  onSeek={handleSeek}
                  onFullscreen={handleFullscreen}
                  onSkipBack={skipBack}
                  onSkipForward={skipForward}
                />
              </>
            )}
          </div>

          {/* Video Selector */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-400" />
            </button>

            <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
              {DEMO_VIDEOS.map((video, index) => (
                <button
                  key={video.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsPlaying(false);
                    setProgress(0);
                    setCurrentTime(0);
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    index === activeIndex
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {video.title}
                </button>
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoVideoPlayer;
