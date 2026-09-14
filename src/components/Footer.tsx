import React from 'react';
import { Zap, ShieldCheck, Heart, Github } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenFaq?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenFaq }) => {
  return (
    <footer className="mt-16 border-t border-zinc-800/80 bg-zinc-950 py-10 text-xs text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand info */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Zap className="h-4 w-4 fill-white" />
            </div>
            <div>
              <p className="font-bold text-zinc-200">
                FastImage<span className="text-blue-400">KB</span>
              </p>
              <p className="text-[11px] text-zinc-400">
                Zero-Server Client-Side Image Resizer & Target KB Compressor
              </p>
            </div>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-zinc-400">
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
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>100% In-Browser Execution • No Data Uploaded</span>
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-900 pt-6 text-center text-[11px] text-zinc-400">
          FastImageKB — Free & Universal Image Optimizer. Built with HTML5 Canvas API & Tailwind CSS.
        </div>
      </div>
    </footer>
  );
};
