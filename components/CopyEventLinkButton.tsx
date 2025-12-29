"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function CopyEventLinkButton({ 
  userSlug, 
  eventSlug 
}: { 
  userSlug: string; 
  eventSlug: string; 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/${userSlug}/${eventSlug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors duration-200
                 text-subtle hover:text-brand"
      title="Copy link"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}