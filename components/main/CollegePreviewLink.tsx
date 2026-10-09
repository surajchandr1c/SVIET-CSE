"use client";

import Link from "next/link";
import Image from "next/image";

export default function CollegePreviewLink() {
  return (
    <div className="group fixed bottom-48 right-4 z-50 flex flex-col items-center gap-2 sm:right-6 md:bottom-52 md:right-8">
      {/* Tooltip Preview */}
      <div className="pointer-events-none absolute bottom-full right-0 mb-4 hidden w-[300px] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 opacity-0 shadow-2xl transition-all duration-300 group-hover:pointer-events-auto group-hover:flex group-hover:opacity-100 sm:w-[340px]">
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-gradient-to-b from-blue-50/60 to-white p-5 text-center">
          <Image
            src="/logo.jpeg"
            alt="SVIET Logo"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
          <h4 className="mt-3 text-sm font-bold text-slate-900">SVIET Official Website</h4>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Swami Vivekanand Group of Engineering &amp; Technology
          </p>
          <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-600 px-3.5 py-1 text-xs font-semibold text-white shadow-sm">
            Visit sviet.ac.in ↗
          </span>
        </div>
      </div>
      
      {/* College Logo Button */}
      <Link 
        href="https://www.sviet.ac.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-gray-200 transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16"
      >
        <Image
          src="/logo.jpeg"
          alt="SVIET Logo"
          width={64}
          height={64}
          className="h-full w-full object-contain p-1.5"
        />
      </Link>
      
      {/* Label */}
      <span className="w-20 text-center text-[10px] font-semibold leading-tight text-gray-600 sm:w-24 sm:text-xs">
        Visit for more details
      </span>
    </div>
  );
}