"use client";

import { useState } from "react";
import { Phone, MessageCircle, Save, Loader2, Check, AlertCircle } from "lucide-react";

interface PageSettingsFormProps {
  projectSlug: string;
  defaultPhone: string;
  defaultWhatsapp: string;
  savedPhone: string | null;
  savedWhatsapp: string | null;
}

export function PageSettingsForm({
  projectSlug,
  defaultPhone,
  defaultWhatsapp,
  savedPhone,
  savedWhatsapp,
}: PageSettingsFormProps) {
  const [phone, setPhone] = useState(savedPhone ?? defaultPhone);
  const [whatsapp, setWhatsapp] = useState(savedWhatsapp ?? defaultWhatsapp);
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/page-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_slug: projectSlug,
          phone: phone.trim() || null,
          whatsapp_number: whatsapp.trim() || null,
        }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4 p-4 rounded-xl border border-navy/10 bg-white">
      <div className="min-w-[140px]">
        <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1">
          <Phone size={16} className="text-blue-600 shrink-0" aria-hidden />
          Phone (call)
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-navy/20 px-3 py-2 text-navy focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none"
          placeholder="201234567890"
        />
      </div>
      <div className="min-w-[140px]">
        <label className="flex items-center gap-2 text-sm font-medium text-navy mb-1">
          <MessageCircle size={16} className="text-green-500 shrink-0" aria-hidden />
          WhatsApp
        </label>
        <input
          type="text"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full rounded-lg border border-navy/20 px-3 py-2 text-navy focus:border-gold focus:ring-1 focus:ring-gold/20 focus:outline-none"
          placeholder="201234567890"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center gap-2 rounded-lg bg-gold text-white px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 size={16} className="animate-spin text-white shrink-0" aria-hidden />
        ) : status === "saved" ? (
          <Check size={16} className="text-white shrink-0" aria-hidden />
        ) : (
          <Save size={16} className="text-white shrink-0" aria-hidden />
        )}
        {status === "loading" ? "Saving…" : status === "saved" ? "Saved" : "Save"}
      </button>
      {status === "error" && (
        <span className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle size={14} className="text-red-600 shrink-0" aria-hidden />
          Error
        </span>
      )}
    </form>
  );
}
