"use client";

import { useState } from "react";
import { CheckCircle2, Copy } from "lucide-react";

export function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
        copied 
          ? "bg-green-500 text-white" 
          : "bg-brand-purple hover:bg-brand-purple-dark text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
      }`}
    >
      {copied ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-5 h-5" />
          Copy Link
        </>
      )}
    </button>
  );
}
