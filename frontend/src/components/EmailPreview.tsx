"use client";

import { useState } from "react";
import { Copy, Check, Send, Edit3, RefreshCw } from "lucide-react";

interface EmailPreviewProps {
  subject: string;
  body: string;
  recipientName: string;
  recipientEmail: string;
  onSend: (subject: string, body: string) => void;
  onRegenerate: () => void;
  isSending: boolean;
  emailSent: boolean;
}

export default function EmailPreview({
  subject,
  body,
  recipientName,
  recipientEmail,
  onSend,
  onRegenerate,
  isSending,
  emailSent,
}: EmailPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedBody, setEditedBody] = useState(body);
  const [editedSubject, setEditedSubject] = useState(subject);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`Subject: ${editedSubject}\n\n${editedBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden slide-up">
      {/* Header */}
      <div className="border-b border-white/8 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-white/30 uppercase tracking-wider font-medium mb-1">
            Email Preview
          </p>
          <p className="text-sm text-white/60">
            To: <span className="text-white/80">{recipientName}</span>
            {recipientEmail && (
              <span className="text-white/30 ml-1">&#60;{recipientEmail}&#62;</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditMode(!editMode)}
            className={`p-2 rounded-lg transition-colors ${
              editMode
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-white/30 hover:text-white/60 hover:bg-white/5"
            }`}
            title="Edit"
          >
            <Edit3 size={15} />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
            title="Copy"
          >
            {copied ? (
              <Check size={15} className="text-emerald-400" />
            ) : (
              <Copy size={15} />
            )}
          </button>
        </div>
      </div>

      {/* Subject */}
      <div className="border-b border-white/5 px-5 py-3">
        <span className="text-xs text-white/25 mr-2 font-medium">SUBJECT</span>
        {editMode ? (
          <input
            value={editedSubject}
            onChange={(e) => setEditedSubject(e.target.value)}
            className="bg-transparent text-sm text-white/90 outline-none w-full font-medium"
          />
        ) : (
          <span className="text-sm text-white/90 font-medium">{editedSubject}</span>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-5 min-h-[280px]">
        {editMode ? (
          <textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            className="w-full h-64 bg-transparent text-sm text-white/75 leading-relaxed outline-none resize-none font-mono"
          />
        ) : (
          <pre className="text-sm text-white/75 leading-relaxed whitespace-pre-wrap font-sans">
            {editedBody}
          </pre>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-white/8 px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => onSend(editedSubject, editedBody)}
          disabled={isSending || emailSent}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            emailSent
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          }`}
        >
          {isSending ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending…
            </>
          ) : emailSent ? (
            <>
              <Check size={14} />
              Email Sent
            </>
          ) : (
            <>
              <Send size={14} />
              Send Email
            </>
          )}
        </button>

        <button
          onClick={onRegenerate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
        >
          <RefreshCw size={14} />
          Regenerate
        </button>
      </div>
    </div>
  );
}
