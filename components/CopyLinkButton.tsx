"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyLinkButton({ userSlug }: { userSlug: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/${userSlug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark 
                 transition-all duration-300 hover:-translate-y-0.5 text-sm font-medium
                 flex items-center gap-2 whitespace-nowrap"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          Copy Link
        </>
      )}
    </button>
  );
}