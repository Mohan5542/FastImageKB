import React from 'react';
import { Zap, ShieldCheck, Heart, Github } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenFaq?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenFaq }) => {
  return (
    <footer className="mt-8 sm:mt-16 border-t border-zinc-800/80 bg-zinc-950 py-6 sm:py-10 text-xs text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Brand info */}
          <div className="flex flex-col md:flex-row items-center gap-2 sm:gap-3 text-center md:text-left">
            <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 fill-white" />
            </div>
            <div>
              <p className="font-bold text-zinc-200 text-[11px] sm:text-xs">
                FastImage<span className="text-blue-400">KB</span>
              </p>
              <p className="text-[10px] sm:text-[11px] text-zinc-400">
                Zero-Server Image Resizer & Target KB Compressor
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs text-zinc-400">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-zinc-200 transition-colors"
            >
              Privacy & Security Guarantee
            </button>
            <button
              onClick={onOpenFaq}
              className="hover:text-zinc-200 transition-colors"
            >
              FAQ & Guidelines
            </button>
          </div>

          {/* Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-zinc-400">
            <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
            <span>100% In-Browser Execution • No Data Uploaded</span>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-zinc-900 pt-4 sm:pt-6 text-center text-[9px] sm:text-[11px] text-zinc-400">
          FastImageKB — Free & Universal Image Optimizer. Built with HTML5 Canvas API & Tailwind CSS.
        </div>
      </div>
    </footer>
  );
};
