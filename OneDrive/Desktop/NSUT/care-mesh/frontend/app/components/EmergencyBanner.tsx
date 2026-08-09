"use client";

import React, { useState } from "react";
import { Phone } from "lucide-react";
import EmergencyModal from "./EmergencyModal";

/**
 * Persistent emergency banner fixed at the bottom of the viewport.
 * - Muted danger background (bg-emergency with opacity).
 * - Click behavior: mobile → tel:112, desktop → open modal.
 * - No close button; always present.
 */
export default function EmergencyBanner() {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    // Simple breakpoint check (mobile if width < 640px)
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      // Mobile – direct call
      window.location.href = "tel:112";
    } else {
      // Desktop – show modal with more options
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed inset-x-0 bottom-0 z-50 h-12 flex items-center justify-center bg-emergency/30 text-text-dark text-sm hover:bg-emergency/40 transition-colors duration-300"
      >
        <Phone className="mr-1" size={16} />
        In crisis? Call 112 or tap here for immediate help
      </button>

      {showModal && <EmergencyModal onClose={() => setShowModal(false)} />}
    </>
  );
}
