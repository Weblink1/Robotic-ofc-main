"use client"

import React from "react"
import Link from "next/link"
import { FaArrowLeft } from "react-icons/fa"
import { GallerySection } from "../(home)/_components/gallery-section"

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#05070b] text-white pt-24 pb-16 relative overflow-hidden">
      {/* Return to Home Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mb-6">
        <Link 
          href="/#gallery"
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white/80 hover:text-white transition-all text-xs font-mono uppercase tracking-widest"
        >
          <FaArrowLeft size={10} />
          <span>Back to Home Experience</span>
        </Link>
      </div>

      {/* Embedded High-Fidelity Horizontal Gallery Section */}
      <GallerySection />
    </main>
  )
}
