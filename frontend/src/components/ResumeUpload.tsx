"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

interface ResumeUploadProps {
  onFileSelect: (file: File | null) => void;
  file: File | null;
}

export default function ResumeUpload({ onFileSelect, file }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf" && dropped.size <= MAX_SIZE) {
      onFileSelect(dropped);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.size <= MAX_SIZE) onFileSelect(selected);
  };

  if (file) {
    return (
      <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
          <FileText size={16} className="text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white/80 truncate">{file.name}</p>
          <p className="text-xs text-white/30">
            {(file.size / 1024).toFixed(0)} KB · PDF
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-400" />
          <button
            onClick={() => onFileSelect(null)}
            className="text-white/20 hover:text-white/60 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
        isDragging
          ? "border-indigo-500/60 bg-indigo-500/10"
          : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleChange}
      />
      <Upload size={22} className="mx-auto text-white/25 mb-3" />
      <p className="text-sm text-white/50 font-medium">
        Drop your resume here or{" "}
        <span className="text-indigo-400">click to browse</span>
      </p>
      <p className="text-xs text-white/25 mt-1">PDF only · Max 5MB</p>
    </div>
  );
}
