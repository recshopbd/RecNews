import React from 'react';

export default function AdsterraNativeAd() {
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; background: transparent; display: flex; justify-content: center; }
        </style>
      </head>
      <body>
        <script async="async" data-cfasync="false" src="https://pl29071803.profitablecpmratenetwork.com/a7ce6a27189ea000e9bd5ddf24ac9d94/invoke.js"></script>
        <div id="container-a7ce6a27189ea000e9bd5ddf24ac9d94"></div>
      </body>
    </html>
  `;

  return (
    <div className="w-full flex flex-col items-center justify-center my-12">
      <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 mb-2 block">Sponsored Content</span>
      <iframe
        title="Native Ad"
        className="w-full max-w-3xl"
        style={{ height: '250px', border: 'none', overflow: 'hidden' }}
        srcDoc={adHtml}
        scrolling="no"
      />
    </div>
  );
}
