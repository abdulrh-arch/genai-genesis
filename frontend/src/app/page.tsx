"use client";

import Link from "next/link";
import {
  Mail,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Linkedin,
  FileText,
  Send,
} from "lucide-react";

const features = [
  {
    icon: <Linkedin size={22} className="text-blue-400" />,
    title: "LinkedIn Research Agent",
    desc: "Automatically scrapes recruiter profile and company data to craft hyper-personalized openers.",
  },
  {
    icon: <Shield size={22} className="text-emerald-400" />,
    title: "Zero-Hallucination Review",
    desc: "Programmatic review agent strips generic AI filler and blocks fake attachment references.",
  },
  {
    icon: <FileText size={22} className="text-violet-400" />,
    title: "Resume-Aware Drafting",
    desc: "Pulls real skills and projects from your uploaded resume — no invented credentials.",
  },
  {
    icon: <Send size={22} className="text-amber-400" />,
    title: "Gmail Drafts Integration",
    desc: "Sends polished drafts directly to your Gmail inbox, ready to review and fire off.",
  },
];

const steps = [
  { label: "Paste recruiter's LinkedIn URL", num: "01" },
  { label: "Upload your resume & portfolio link", num: "02" },
  { label: "AI researches, writes & reviews", num: "03" },
  { label: "Draft lands in your Gmail", num: "04" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Mail size={16} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">MailForge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/history" className="text-white/40 hover:text-white/70 transition-colors text-sm">
              History
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors px-4 py-2 rounded-lg text-sm font-medium"
            >
              Launch App <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <Zap size={12} className="fill-indigo-400 text-indigo-400" />
            Built for summer internship season
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Cold emails that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              actually land
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered orchestrator that researches recruiters, writes personalized
            cold emails from your real resume, strips hallucinations, and drops
            polished drafts straight into your Gmail.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-all hover:scale-105 px-6 py-3 rounded-xl font-semibold text-base shadow-lg shadow-indigo-900/40"
            >
              Start crafting emails <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="text-white/50 hover:text-white transition-colors text-sm"
            >
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="border-y border-white/5 bg-white/[0.02] py-4 px-6">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
          {[
            "No generic AI phrases",
            "No fake attachments",
            "No placeholder text",
            "Real resume data only",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-500" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Every step, verified
          </h2>
          <p className="text-white/40 text-center mb-12 max-w-xl mx-auto">
            Four specialized agents work together to make sure nothing embarrassing
            slips through.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How it works</h2>
          <p className="text-white/40 text-center mb-16 max-w-lg mx-auto">
            Four steps from LinkedIn URL to Gmail draft — the whole pipeline runs
            automatically.
          </p>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-indigo-500 to-violet-500 opacity-30" />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <div key={step.num} className="flex items-start gap-6 relative">
                  <div
                    className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400 font-mono text-xs font-bold z-10"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {step.num}
                  </div>
                  <div className="pt-3">
                    <p className="font-medium text-white/90">{step.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-indigo-900/30"
            >
              Get started free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-white/25">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail size={14} />
          <span className="font-medium text-white/40">MailForge</span>
        </div>
        <p>Built at hackathon — for internship hunters, by internship hunters.</p>
      </footer>
    </div>
  );
}
