"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WhatsAppButton() {
    const phoneNumber = "918424813572";
    const message = "Hello! I would like to know more about your products.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95",
                "bg-[#25D366] text-white hover:bg-[#128C7E]"
            )}
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle className="h-8 w-8" fill="currentColor" />
            <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100">
                Chat with us
            </span>
        </a>
    );
}
