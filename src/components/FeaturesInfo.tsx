import React from 'react';
import {
  Code,
  GraduationCap,
  Sparkles,
  Briefcase,
  ShieldCheck,
  Cpu,
  Infinity as InfinityIcon,
  CheckCircle2
} from 'lucide-react';

export const FeaturesInfo: React.FC = () => {
  const useCases = [
    {
      icon: Code,
      title: 'Web Developers & SEO',
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      description:
        'Generate ultra-fast WebP & lightweight JPEG assets to boost Google PageSpeed & Core Web Vitals scores.',
    },
    {
      icon: GraduationCap,
      title: 'Students & Applicants',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description:
        'Easily hit strict upload limits (<20KB, <50KB, <100KB) for university portals, visa applications, and student IDs.',
    },
    {
      icon: Briefcase,
      title: 'Job Seekers & Pros',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      description:
        'Compress resumes, portfolio mockups, headshots, and email attachments without losing crisp text clarity.',
    },
    {
      icon: Sparkles,
      title: 'Creators & Designers',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      description:
        'Batch resize social media banners, avatar thumbnails, and high-res photography in seconds directly in-browser.',
    },
  ];

  const highlights = [
    {
      icon: ShieldCheck,
      title: '100% Client-Side Privacy',
      desc: 'Your photos never touch a remote server or cloud database. All transformations occur exclusively inside your device memory.',
    },
    {
      icon: Cpu,
      title: 'Binary Search Precision',
      desc: 'Intelligent iterative canvas engine automatically converges on the highest visual quality that stays below your exact target KB.',
    },
    {
      icon: InfinityIcon,
      title: 'Zero Limits, Free Forever',
      desc: 'No subscription tiers, no hidden watermarks, and no file quantity caps. Completely free forever with zero login required.',
    },
  ];

  return (
    <div className="space-y-12 pt-8">
      {/* Universal Use-Cases Grid */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Built for Every Workflow
          </h2>
          <p className="text-xs text-zinc-400 sm:text-sm">
            A universal precision image tool crafted for creators, professionals, and students.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((uc) => {
            const Icon = uc.icon;
            return (
              <div
                key={uc.title}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/70"
              >
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border ${uc.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-200">{uc.title}</h3>
                <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{uc.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tech Architecture Highlights */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8">
        <div className="mx-auto max-w-3xl text-center space-y-2 mb-8">
          <span className="text-xs font-semibold text-blue-400 tracking-wider uppercase">
            Pure Browser Architecture
          </span>
          <h3 className="text-lg font-bold text-white sm:text-xl">
            How FastImageKB Works Without Servers
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            By leveraging modern HTML5 OffscreenCanvas and WebAssembly graphics capabilities, your device processes raw image pixels locally with zero latency, zero cloud storage, and absolute privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {highlights.map((hl) => {
            const Icon = hl.icon;
            return (
              <div key={hl.title} className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-200 font-semibold text-sm">
                  <Icon className="h-4 w-4 text-blue-400" />
                  <span>{hl.title}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{hl.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
