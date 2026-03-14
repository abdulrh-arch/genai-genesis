"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertTriangle } from "lucide-react";

export default function GmailConnect() {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [configured, setConfigured] = useState<boolean>(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    // If redirected back from OAuth with ?gmail=connected, mark as connected
    if (searchParams.get("gmail") === "connected") {
      setConnected(true);
      return;
    }
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/gmail/status`
          : "http://localhost:8000/api/auth/gmail/status"
      );
      const data = await res.json();
      setConnected(data.connected);
      setConfigured(data.configured ?? true);
    } catch {
      setConnected(false);
    }
  };

  const handleConnect = () => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    window.location.href = `${base}/api/auth/gmail`;
  };

  // Still loading
  if (connected === null) return null;

  // Connected
  if (connected) {
    return (
      <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
        <CheckCircle size={15} className="text-emerald-400 shrink-0" />
        <p className="text-sm text-emerald-300 font-medium">Gmail connected</p>
      </div>
    );
  }

  // OAuth credentials not configured in backend
  if (!configured) {
    return (
      <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
        <AlertTriangle size={15} className="text-red-400 shrink-0" />
        <p className="text-sm text-red-300">
          Gmail OAuth not configured — set <code className="text-red-200 bg-red-500/20 px-1 rounded">GOOGLE_CLIENT_ID</code> &amp; <code className="text-red-200 bg-red-500/20 px-1 rounded">GOOGLE_CLIENT_SECRET</code> in backend <code className="text-red-200 bg-red-500/20 px-1 rounded">.env</code>
        </p>
      </div>
    );
  }

  // Not connected
  return (
    <div className="flex items-center justify-between gap-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2.5">
        <AlertTriangle size={15} className="text-amber-400 shrink-0" />
        <p className="text-sm text-amber-300">
          Connect Gmail to send emails
        </p>
      </div>
      <button
        onClick={handleConnect}
        className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100 transition-colors px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Connect Gmail
      </button>
    </div>
  );
}
