import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-amber-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#1e1611] border border-[#3d2b20] shadow-2xl text-white text-sm max-w-sm animate-bounce-short">
      {icons[toast.type || 'success']}
      <p className="flex-1 text-xs text-[#f0e6dc] leading-relaxed">
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="text-[#8c7b6e] hover:text-white transition-all cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

