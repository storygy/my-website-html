import { useEffect, useRef } from 'react';
import type { AppItem } from '@/types/app';

interface AppViewerProps {
  app: AppItem;
}

export function AppViewer({ app }: AppViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // 设置页面标题和meta标签（用于微信分享）
    document.title = app.title;
    
    // 设置微信分享meta标签
    const setWechatMeta = () => {
      // 清除旧的
      const oldMetas = document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]');
      oldMetas.forEach(meta => meta.remove());

      const metas = [
        { property: 'og:title', content: app.title },
        { property: 'og:description', content: app.description || '来看看这个有趣的应用吧！' },
        { property: 'og:url', content: window.location.href },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:title', content: app.title },
        { name: 'twitter:description', content: app.description || '来看看这个有趣的应用吧！' },
      ];

      if (app.thumbnail) {
        metas.push({ property: 'og:image', content: app.thumbnail });
        metas.push({ name: 'twitter:image', content: app.thumbnail });
      }

      metas.forEach(({ property, name, content }) => {
        const meta = document.createElement('meta');
        if (property) meta.setAttribute('property', property);
        if (name) meta.setAttribute('name', name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      });
    };

    setWechatMeta();

    // 写入iframe
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(app.htmlContent);
        doc.close();
      }
    }
  }, [app]);

  return (
    <div className="w-full h-screen">
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        title={app.title}
      />
    </div>
  );
}
