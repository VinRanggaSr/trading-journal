import { useEffect, useRef } from 'react';

export function StockChart({ ticker }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    if (!ticker) {
      const placeholderWrap = document.createElement('div');
      placeholderWrap.className = 'flex h-full items-center justify-center';
      const placeholder = document.createElement('p');
      placeholder.className = 'text-sm text-ink-faint';
      placeholder.textContent = 'Isi ticker dulu untuk melihat chart';
      placeholderWrap.appendChild(placeholder);
      containerRef.current.appendChild(placeholderWrap);
      return;
    }

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    containerRef.current.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `IDX:${ticker.toUpperCase()}`,
      interval: 'D',
      timezone: 'Asia/Jakarta',
      theme: 'light',
      style: '1',
      locale: 'id',
      allow_symbol_change: true,
      hide_top_toolbar: false,
      support_host: 'https://www.tradingview.com'
    });

    containerRef.current.appendChild(script);
  }, [ticker]);

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-inset ring-border" style={{ height: 672 }}>
      <div className="tradingview-widget-container h-full w-full" ref={containerRef} />
    </div>
  );
}
