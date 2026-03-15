"use client";

import Link from "next/link";
import {
  Mail, Shield, Zap, CheckCircle, ArrowRight, FileText, Send,
} from "lucide-react";

const features = [
  {
    icon: <Shield size={22} className="text-emerald-400" />,
    title: "Zero-Hallucination Review",
    desc: "Programmatic review agent strips generic AI filler and blocks fake attachment references.",
    color: "emerald",
  },
  {
    icon: <FileText size={22} className="text-violet-400" />,
    title: "Resume-Aware Drafting",
    desc: "Pulls real skills and projects from your uploaded resume — no invented credentials.",
    color: "violet",
  },
  {
    icon: <Send size={22} className="text-amber-400" />,
    title: "Gmail Integration",
    desc: "Sends polished emails directly to your recruiter straight from your Gmail account.",
    color: "amber",
  },
  {
    icon: <Zap size={22} className="text-indigo-400" />,
    title: "Multi-Agent Pipeline",
    desc: "Four specialized AI agents collaborate — analyze, draft, format, and send.",
    color: "indigo",
  },
];

const steps = [
  { label: "Paste the job description", num: "01", desc: "Copy from LinkedIn, Indeed, or any job board" },
  { label: "Upload your resume", num: "02", desc: "PDF format, up to 5MB" },
  { label: "AI researches & writes", num: "03", desc: "Three agents craft your personalized email" },
  { label: "Email lands in recruiter's inbox", num: "04", desc: "Sent directly via your Gmail account" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 fade-in">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50">
              <Mail size={16} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Cold Email Agent</span>
          </div>
          <div className="flex items-center gap-3 fade-in">
            <Link href="/history" className="text-white/40 hover:text-white/70 transition-colors text-sm">
              History
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-all hover:scale-105 btn-press px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-900/30"
            >
              Launch App <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6 text-center relative overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/8 rounded-full blur-3xl orb-float" />
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-violet-600/6 rounded-full blur-3xl orb-float-slow" />
          <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-3xl orb-float" style={{animationDelay: "4s"}} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="fade-in-up inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 rounded-full px-4 py-1.5 text-sm text-indigo-300 mb-8">
            <Zap size={12} className="fill-indigo-400 text-indigo-400" />
            Let's get you hired
          </div>

          <h1 className="fade-in-up delay-100 text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Cold emails that{" "}
            <span className="animated-gradient-text">actually land</span>
          </h1>

          <p className="fade-in-up delay-200 text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered orchestrator that researches recruiters, writes personalized
            cold emails from your real resume, and sends them straight from your Gmail.
          </p>

          <div className="fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-all hover:scale-105 btn-press px-6 py-3 rounded-xl font-semibold text-base shadow-xl shadow-indigo-900/40"
            >
              Start crafting emails <ArrowRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="text-white/40 hover:text-white/70 transition-colors text-sm"
            >
              See how it works ↓
            </a>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="border-y border-white/5 bg-white/[0.02] py-4 px-6 fade-in delay-400">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
          {["No generic AI phrases", "No fake attachments", "No placeholder text", "Real resume data only"].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle size={14} className="text-emerald-500" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto">
          <h2 className="fade-in-up text-3xl font-bold text-center mb-4">How it works</h2>
          <p className="fade-in-up delay-100 text-white/40 text-center mb-16 max-w-lg mx-auto">
            From job description to sent email in under 30 seconds.
          </p>

          <div className="relative">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-indigo-500 via-violet-500 to-transparent opacity-30" />
            <div className="space-y-8">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className="fade-in-up flex items-start gap-6 relative"
                  style={{ animationDelay: `${i * 0.12}s`, opacity: 0 }}
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400 font-mono text-xs font-bold z-10 shadow-lg shadow-indigo-900/20">
                    {step.num}
                  </div>
                  <div className="pt-2">
                    <p className="font-semibold text-white/90 mb-1">{step.label}</p>
                    <p className="text-sm text-white/35">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center fade-in-up delay-500">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all hover:scale-105 btn-press px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-indigo-900/30"
            >
              Get started free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-sm text-white/25">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-indigo-600/60 flex items-center justify-center">
            <Mail size={11} />
          </div>
          <span className="font-medium text-white/40">Cold Email Agent</span>
        </div>
        <p>Built for internship hunters, by internship hunters.</p>
      </footer>
    </div>
  );
}
