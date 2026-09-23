"use client";

import React from "react";

interface TiltCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function TiltCard({ children, onClick, className = "" }: TiltCardProps) {
  return (
    <div
      onClick={onClick}
      className={`transition-transform duration-150 ease-out hover:-translate-y-1 hover:-translate-x-1 ${className}`}
    >
      {children}
    </div>
  );
}
