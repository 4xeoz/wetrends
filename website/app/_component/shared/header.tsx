"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function Navbar() {
  const [animateDown, setAnimateDown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateDown(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center">
      <div
        className={`fixed left-1/2 top-[-300] -translate-x-1/2 z-50 flex items-center gap-3 rounded-full w-fit bg-wetrends px-8 py-4 shadow-lg transition-transform duration-700 ${
          animateDown ? "translate-y-80" : ""
        }`}
      >
        <Image
          src="/images/logo-transparent.svg"
          alt="WeTrends Logo"
          width={48}
          height={48}
          className="object-contain"
        />
        <span className="text-2xl font-bold text-white select-none">WeTrends</span>
      </div>
    </div>
  );
}
