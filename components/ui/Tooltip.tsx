import React, { ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="relative inline-block group">
      {children}
      <div className="absolute bottom-full mb-2 hidden w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 text-center group-hover:block z-10">
        {content}
      </div>
    </div>
  );
}
