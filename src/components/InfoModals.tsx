import React from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, HelpCircle, Cpu, Zap } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="text-base font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const PrivacyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="100% Privacy Guarantee">
      <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
        <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-emerald-300">
          <ShieldCheck className="h-6 w-6 flex-shrink-0" />
          <p className="font-medium">
            Your images NEVER leave your device. There is no backend server receiving or storing your files.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-zinc-100 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-blue-400" />
            How Browser Security Works in FastImageKB:
          </h4>
          <ul className="space-y-1.5 pl-4 list-disc text-zinc-400">
            <li>
              <strong>Local Memory Canvas:</strong> Images are parsed locally using HTML5 <code>ImageBitmap</code> and rendered into an offscreen <code>&lt;canvas&gt;</code> element.
            </li>
            <li>
              <strong>Zero Network Telemetry:</strong> You can disconnect your internet / turn on Airplane Mode, and FastImageKB will continue to resize and compress photos flawlessly.
            </li>
            <li>
              <strong>Instant Memory Cleanup:</strong> Temporary object URLs are revoked upon completion or reset.
            </li>
            <li>
              <strong>Compliance Safe:</strong> Ideal for sensitive documents, government IDs, company confidential assets, medical imagery, and personal portraits.
            </li>
          </ul>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            Got it, thanks
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export const FaqModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const faqs = [
    {
      q: 'How does the Target KB compression work?',
      a: 'FastImageKB runs a high-precision binary search algorithm on the HTML5 Canvas compression quality parameter, testing quality thresholds in milliseconds to produce the highest possible visual fidelity that fits under your target file size limit.',
    },
    {
      q: 'What if a 4K image cannot fit in 20 KB even at low quality?',
      a: 'If the "Auto-downscale" option is checked, the engine intelligently downscales the pixel dimensions incrementally until the file size strictly satisfies your target limit.',
    },
    {
      q: 'Which format should I choose?',
      a: 'WebP is ideal for websites and apps (smaller file size, supports transparency). JPEG is the universal standard for portals, forms, and email attachments. PNG is lossless and preserves exact crisp pixel details and transparent backgrounds.',
    },
    {
      q: 'Is there a limit on how many images I can compress?',
      a: 'No limit! You can process single images or queue dozens of images at once and download them all in a single ZIP file.',
    },
  ];

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Frequently Asked Questions">
      <div className="space-y-3 text-xs text-zinc-300">
        {faqs.map((f, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-1">
            <h4 className="font-semibold text-zinc-100 flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
              {f.q}
            </h4>
            <p className="text-zinc-400 leading-relaxed pl-5">{f.a}</p>
          </div>
        ))}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
