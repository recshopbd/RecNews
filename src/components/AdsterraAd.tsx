import React, { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  width: number;
  height: number;
  adKey: string;
}

export default function AdsterraAd({ width, height, adKey }: AdsterraAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing ad scripts to prevent duplicates on re-render
    containerRef.current.innerHTML = '';

    // If it's a placeholder key, show a visual placeholder instead of loading the script
    if (adKey.includes('YOUR_')) {
      containerRef.current.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center text-zinc-400 font-mono text-xs text-center p-4">
          <span class="text-electric mb-1">Adsterra Ad Space</span>
          <span>${width}x${height}</span>
          <span class="mt-2 text-[10px] opacity-70">Replace '${adKey}' in code</span>
        </div>
      `;
      return;
    }

    // 1. Create the configuration script
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    // 2. Create the invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    // Note: Adsterra domains can vary. If your snippet uses a different domain, update it here.
    invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;

    // 3. Append to the container
    containerRef.current.appendChild(confScript);
    containerRef.current.appendChild(invokeScript);
  }, [adKey, width, height]);

  return (
    <div className="flex justify-center items-center w-full">
      <div 
        ref={containerRef} 
        className="bg-zinc-50 border border-zinc-200 border-dashed overflow-hidden flex items-center justify-center"
        style={{ width: width, height: height }}
      />
    </div>
  );
}
