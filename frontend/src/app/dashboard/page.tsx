"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Sparkles, Globe, AlertCircle } from "lucide-react";
import ResumeUpload from "@/components/ResumeUpload";
import AgentProgress, { AgentStep } from "@/components/AgentProgress";
import EmailPreview from "@/components/EmailPreview";

// ----- Types -----
interface FormData {
  linkedinUrl: string;
  portfolioUrl: string;
  recipientEmail: string;
  tone: "professional" | "friendly" | "concise";
}

type AppState = "idle" | "processing" | "done" | "error";

// ----- Initial agent steps -----
const makeInitialSteps = (): AgentStep[] => [
  {
    id: "research",
    label: "LinkedIn Research Agent",
    description: "Scrapes recruiter profile and company data",
    status: "idle",
  },
  {
    id: "draft",
    label: "Email Drafting Agent",
    description: "Writes a personalized email using your resume",
    status: "idle",
  },
  {
    id: "review",
    label: "Zero-Hallucination Review Agent",
    description: "Strips generic phrases & fake attachment refs",
    status: "idle",
  },
  {
    id: "format",
    label: "Signature Formatter",
    description: "Formats sign-off from your resume data",
    status: "idle",
  },
  {
    id: "send",
    label: "Gmail Draft Writer",
    description: "Pushes finalized email to Gmail drafts",
    status: "idle",
  },
];

// ----- Main page -----
export default function DashboardPage() {
  const [formData, setFormData] = useState<FormData>({
    linkedinUrl: "",
    portfolioUrl: "",
    recipientEmail: "",
    tone: "professional",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [steps, setSteps] = useState<AgentStep[]>(makeInitialSteps());
  const [appState, setAppState] = useState<AppState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Email result state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [draftSent, setDraftSent] = useState(false);

  // ---- helpers ----
  const updateStep = (
    id: string,
    patch: Partial<AgentStep>,
    setter: React.Dispatch<React.SetStateAction<AgentStep[]>>
  ) => {
    setter((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // ---- submit ----
  const handleGenerate = async () => {
    if (!formData.linkedinUrl || !resumeFile) return;

    setAppState("processing");
    setErrorMsg("");
    setDraftSent(false);
    const freshSteps = makeInitialSteps();
    setSteps(freshSteps);

    // Helper that updates steps in state
    const update = (id: string, patch: Partial<AgentStep>) =>
      setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

    try {
      // Step 1: Research
      update("research", { status: "running", detail: "Fetching LinkedIn data…" });

      const fd = new FormData();
      fd.append("linkedin_url", formData.linkedinUrl);
      fd.append("portfolio_url", formData.portfolioUrl);
      fd.append("recipient_email", formData.recipientEmail);
      fd.append("tone", formData.tone);
      fd.append("resume", resumeFile);

      // Call backend — adjust URL to your Python backend
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/generate-email`
          : "http://localhost:8000/api/generate-email",
        {
          method: "POST",
          body: fd,
        }
      );

      update("research", {
        status: "done",
        detail: "Recruiter & company data extracted",
      });
      await sleep(300);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || "Backend error");
      }

      // Step 2: Drafting
      update("draft", { status: "running", detail: "Composing personalized email…" });
      await sleep(200); // Optimistic UI tick

      const data = await res.json();

      update("draft", { status: "done", detail: "Draft generated" });
      await sleep(300);

      // Step 3: Review
      update("review", { status: "running", detail: "Scanning for hallucinations…" });
      await sleep(500);
      update("review", {
        status: "done",
        detail: data.review_notes || "Passed all checks",
      });
      await sleep(300);

      // Step 4: Format
      update("format", { status: "running", detail: "Formatting signature…" });
      await sleep(400);
      update("format", { status: "done", detail: "Signature applied" });
      await sleep(300);

      // Step 5: Send to Gmail drafts (triggered by user)
      update("send", { status: "idle", detail: "Waiting for your confirmation" });

      // Set email result
      setEmailSubject(data.subject || "");
      setEmailBody(data.body || "");
      setRecipientName(data.recipient_name || "Recruiter");
      setAppState("done");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setErrorMsg(message);
      setSteps((prev) =>
        prev.map((s) =>
          s.status === "running" ? { ...s, status: "error", detail: message } : s
        )
      );
      setAppState("error");
    }
  };

  const handleSendToDraft = async () => {
    setIsSending(true);
    setSteps((prev) =>
      prev.map((s) => (s.id === "send" ? { ...s, status: "running", detail: "Pushing to Gmail…" } : s))
    );

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/save-draft`
          : "http://localhost:8000/api/save-draft",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: emailSubject,
            body: emailBody,
            recipient_email: formData.recipientEmail,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to save draft");

      setSteps((prev) =>
        prev.map((s) =>
          s.id === "send"
            ? { ...s, status: "done", detail: "Draft saved to Gmail ✓" }
            : s
        )
      );
      setDraftSent(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to save draft";
      setSteps((prev) =>
        prev.map((s) =>
          s.id === "send" ? { ...s, status: "error", detail: message } : s
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleRegenerate = () => {
    setAppState("idle");
    setEmailSubject("");
    setEmailBody("");
    setDraftSent(false);
    setSteps(makeInitialSteps());
  };

  const isReady = formData.linkedinUrl.trim() && resumeFile;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top bar */}
      <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/"
            className="text-white/25 hover:text-white/60 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <Mail size={12} />
            </div>
            <span className="font-semibold">MailForge</span>
          </div>
          <span className="text-white/20 text-sm ml-2">/ Orchestrator</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* ---- Left: Form + Output ---- */}
          <div className="space-y-6">
            {/* Form card */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-5">
              <div>
                <h1 className="text-xl font-bold mb-1">Generate Cold Email</h1>
                <p className="text-sm text-white/40">
                  Paste a recruiter URL, upload your resume, and let the agents work.
                </p>
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                  Recruiter LinkedIn URL *
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/recruiter-name"
                    value={formData.linkedinUrl}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, linkedinUrl: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              {/* Portfolio URL */}
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                  Portfolio / GitHub URL
                </label>
                <div className="relative">
                  <Globe
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />
                  <input
                    type="url"
                    placeholder="https://github.com/yourname or yourportfolio.com"
                    value={formData.portfolioUrl}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, portfolioUrl: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              {/* Recipient email */}
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                  Recruiter Email (optional)
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25"
                  />
                  <input
                    type="email"
                    placeholder="recruiter@company.com"
                    value={formData.recipientEmail}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        recipientEmail: e.target.value,
                      }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              {/* Tone selector */}
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                  Email Tone
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["professional", "friendly", "concise"] as const).map(
                    (t) => (
                      <button
                        key={t}
                        onClick={() => setFormData((f) => ({ ...f, tone: t }))}
                        className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                          formData.tone === t
                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
                            : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Resume upload */}
              <div>
                <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">
                  Your Resume *
                </label>
                <ResumeUpload file={resumeFile} onFileSelect={setResumeFile} />
              </div>

              {/* Error */}
              {errorMsg && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <AlertCircle
                    size={16}
                    className="text-red-400 mt-0.5 shrink-0"
                  />
                  <p className="text-sm text-red-300">{errorMsg}</p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleGenerate}
                disabled={!isReady || appState === "processing"}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-100 py-3.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-900/30"
              >
                {appState === "processing" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Agents are working…
                  </>
                ) : (
                  <>
                    <Sparkles size={15} />
                    Generate Cold Email
                  </>
                )}
              </button>
            </div>

            {/* Email preview */}
            {appState === "done" && emailBody && (
              <EmailPreview
                subject={emailSubject}
                body={emailBody}
                recipientName={recipientName}
                recipientEmail={formData.recipientEmail}
                onSendToDraft={handleSendToDraft}
                onRegenerate={handleRegenerate}
                isSending={isSending}
                draftSent={draftSent}
              />
            )}
          </div>

          {/* ---- Right: Agent pipeline ---- */}
          <div className="lg:sticky lg:top-20">
            <AgentProgress steps={steps} />

            {/* Tips */}
            <div className="mt-4 bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-3">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                How it works
              </p>
              {[
                "Agent researches the recruiter's LinkedIn and company",
                "Drafts email using only real data from your resume",
                "Review agent removes AI filler & hallucinated claims",
                "Clean draft lands in your Gmail — you hit send",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="text-indigo-500 text-xs font-mono mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs text-white/40 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
