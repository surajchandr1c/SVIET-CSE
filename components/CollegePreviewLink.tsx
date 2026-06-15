"use client";

import Link from "next/link";

export default function CollegePreviewLink() {
  return (
    <div className="group fixed bottom-48 right-4 z-50 flex flex-col items-center gap-2 sm:right-6 md:bottom-52 md:right-8">
      {/* Tooltip Preview */}
      <div className="pointer-events-none absolute bottom-full right-0 mb-4 hidden w-[300px] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 opacity-0 shadow-2xl transition-all duration-300 group-hover:pointer-events-auto group-hover:flex group-hover:opacity-100 sm:w-[360px]">
        <div className="relative h-[200px] w-full overflow-hidden rounded-xl border border-gray-100 bg-gray-50 sm:h-[220px]">
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-500">
            Loading preview...
          </div>
          <iframe 
            src="https://www.sviet.ac.in/" 
            className="absolute inset-0 z-10 h-[400%] w-[400%] origin-top-left scale-[0.25] border-0 bg-white"
            title="SVIET Website Preview"
            loading="lazy"
          />
        </div>
      </div>
      
      {/* College Logo Button */}
      <Link 
        href="https://www.sviet.ac.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-gray-200 transition-transform duration-300 hover:scale-110 sm:h-16 sm:w-16"
      >
        <img
          suppressHydrationWarning
          src="/logo.jpeg"
          alt="SVIET Logo"
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