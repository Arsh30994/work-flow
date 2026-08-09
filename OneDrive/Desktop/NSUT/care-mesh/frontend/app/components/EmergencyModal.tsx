"use client";

import React from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function EmergencyModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-text-dark hover:text-emergency"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-text-dark">
          Immediate Help Options
        </h2>
        <ul className="space-y-3 text-text-dark">
          <li>
            <a href="tel:112" className="text-teracotta font-medium underline">
              Call 112 (emergency services)
            </a>
          </li>
          <li>
            <a
              href="https://www.112.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teracotta font-medium underline"
            >
              Visit 112 website for more resources
            </a>
          </li>
          <li>
            <a
              href="tel:14416"
              className="text-teracotta font-medium underline"
            >
              National mental‑health helpline (Tele‑MANAS): 14416
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
