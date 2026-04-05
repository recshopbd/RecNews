import React from 'react';

interface AdsterraAdProps {
  width: number;
  height: number;
  adKey: string;
}

export default function AdsterraAd({ width, height, adKey }: AdsterraAdProps) {
  // If it's a placeholder key, show a visual placeholder instead of loading the script
  if (adKey.includes('YOUR_')) {
    return (
      <div className="flex justify-center items-center w-full">
        <div 
          className="bg-zinc-50 border border-zinc-200 border-dashed flex flex-col items-center justify-center text-zinc-400 font-mono text-xs text-center p-4"
          style={{ width: width, height: height }}
        >
          <span className="text-electric mb-1">Adsterra Ad Space</span>
          <span>{width}x{height}</span>
          <span className="mt-2 text-[10px] opacity-70">Replace '{adKey}' in code</span>
        </div>
      </div>
    );
  }

  // Adsterra uses a global `atOptions` variable. In a React Single Page Application,
  // multiple ad components rendering at the same time will overwrite each other's 
  // global `atOptions`, causing only one ad (or none) to load correctly.
  // By wrapping the ad script in an iframe using srcDoc, we give each ad its own 
  // isolated window environment, preventing variable collisions.
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            background: transparent; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
          }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          var atOptions = {
            'key' : '${adKey}',
            'format' : 'iframe',
            'height' : ${height},
            'width' : ${width},
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="flex justify-center items-center w-full overflow-hidden">
      <iframe
        title={`Adsterra ${width}x${height}`}
        width={width}
        height={height}
        srcDoc={adHtml}
        frameBorder="0"
        scrolling="no"
        loading="lazy"
        style={{ 
          border: 'none', 
          overflow: 'hidden', 
          width: `${width}px`, 
          height: `${height}px`,
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
}
