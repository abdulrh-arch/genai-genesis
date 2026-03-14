"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Clock, Send, ChevronDown, ChevronUp, Inbox } from "lucide-react";

interface EmailRecord {
  id: string;
  recipient_email: string;
  recipient_name: string;
  subject: string;
  body: string;
  tone: string;
  sent_at: string;
  status: "sent" | "failed";
}

export default function HistoryPage() {
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_URL
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/emails`
            : "http://localhost:8000/api/emails"
        );
        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setEmails(data.emails || []);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top bar */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="text-white/25 hover:text-white/60 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <Mail size={12} />
            </div>
            <span className="font-semibold">MailForge</span>
          </div>
          <span className="text-white/20 text-sm ml-2">/ History</span>

          <div className="ml-auto">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
            >
              <Send size={13} />
              New Email
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Email History</h1>
          <p className="text-white/40 text-sm">All cold emails generated and sent.</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-24 text-white/30">
            <span className="w-5 h-5 border-2 border-white/20 border-t-indigo-400 rounded-full animate-spin mr-3" />
            Loading history…
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && emails.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-white/20">
            <Inbox size={40} className="mb-4" />
            <p className="font-medium text-white/30">No emails sent yet</p>
            <p className="text-sm mt-1">Generate your first cold email to see it here.</p>
            <Link
              href="/dashboard"
              className="mt-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors px-5 py-2.5 rounded-xl text-sm font-medium text-white"
            >
              <Send size={14} />
              Generate Email
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && !error && emails.length > 0 && (
          <div className="space-y-3">
            {/* Stats bar */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{emails.length}</p>
                <p className="text-xs text-white/40 mt-0.5">Total emails sent</p>
              </div>
              <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4">
                <p className="text-2xl font-bold text-emerald-400">
                  {emails.filter((e) => e.status === "sent").length}
                </p>
                <p className="text-xs text-white/40 mt-0.5">Successfully delivered</p>
              </div>
            </div>

            {emails.map((email) => (
              <div
                key={email.id}
                className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden"
              >
                {/* Row */}
                <button
                  className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                  onClick={() =>
                    setExpanded(expanded === email.id ? null : email.id)
                  }
                >
                  {/* Status dot */}
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      email.status === "sent" ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-0.5">
                      <p className="text-sm font-medium text-white/90 truncate">
                        {email.subject}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                          email.status === "sent"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {email.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/30 truncate">
                      To: {email.recipient_name
                        ? `${email.recipient_name} <${email.recipient_email}>`
                        : email.recipient_email}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-white/25 text-xs">
                      <Clock size={11} />
                      {formatDate(email.sent_at)}
                    </div>
                    {expanded === email.id ? (
                      <ChevronUp size={15} className="text-white/25" />
                    ) : (
                      <ChevronDown size={15} className="text-white/25" />
                    )}
                  </div>
                </button>

                {/* Expanded body */}
                {expanded === email.id && (
                  <div className="border-t border-white/5 px-5 py-4">
                    <pre className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap font-sans">
                      {email.body}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
