import React from 'react';
import { ShieldCheck, Zap, Lock, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenFaq?: () => void;
  onOpenPrivacy?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFaq, onOpenPrivacy }) => {
  return (
    <header className="w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Top Trust Badge Banner */}
      <div className="border-b border-zinc-800/50 bg-zinc-900/60 px-4 py-1.5 text-center text-xs font-medium text-zinc-300">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 flex-wrap sm:gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>No sign-up required</span>
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-sky-400">
            <Lock className="h-3.5 w-3.5" />
            <span>100% Private (files never leave your browser)</span>
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Free forever</span>
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20">
            <Zap className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">FastImage<span className="text-blue-400">KB</span></span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              Intelligent Target-KB Image Resizer & Compressor
            </p>
          </div>
        </div>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenPrivacy}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            title="How browser privacy works"
            id="nav-privacy-btn"
          >
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden md:inline">Browser-Only Security</span>
            <span className="md:hidden">Privacy</span>
          </button>

          <button
            onClick={onOpenFaq}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            title="Frequently Asked Questions & Use Cases"
            id="nav-faq-btn"
          >
            <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
            <span>How it Works</span>
          </button>
        </div>
      </div>
    </header>
  );
};
