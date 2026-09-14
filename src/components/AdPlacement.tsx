import React from 'react';

interface AdPlacementProps {
  slot: 'top-banner' | 'sidebar' | 'footer-banner';
  className?: string;
}

export const AdPlacement: React.FC<AdPlacementProps> = ({ slot, className = '' }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-300 hover:border-zinc-700/80 ${className}`}
      id={`ad-placement-${slot}`}
    >
      {/* HTML Comment representation for SEO/Ad networks as requested */}
      {/* <!-- Ad Placement Area --> */}
      
      <div className="flex flex-col items-center justify-center text-center">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-zinc-800/80 px-2 py-0.5 text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
            Sponsored
          </span>
          <span className="text-xs text-zinc-400">Ad Placement Area</span>
        </div>
        
        <p className="mt-1 text-xs text-zinc-400">
          Clean, privacy-first sponsor space supporting 100% free tooling.
        </p>
      </div>
    </div>
  );
};
