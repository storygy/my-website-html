import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import type { AppItem } from '@/types/app';

interface PreviewDialogProps {
  app: AppItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenInNewTab?: (app: AppItem) => void;
}

export function PreviewDialog({ app, open, onOpenChange, onOpenInNewTab }: PreviewDialogProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (open && app && iframeRef.current) {
      setLoading(true);
      setLoadError(false);
      const iframe = iframeRef.current;
      
      try {
        // 使用 Blob URL 方式加载
        const blob = new Blob([app.htmlContent], { type: 'text/html; charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        iframe.src = url;
        
        // 设置加载超时
        const timer = setTimeout(() => {
          setLoading(false);
          // 如果 3 秒后还在加载，显示错误
          if (!iframe.contentDocument?.body?.innerHTML) {
            setLoadError(true);
          }
        }, 3000);
        
        iframe.onload = () => {
          clearTimeout(timer);
          setLoading(false);
        };
        
        iframe.onerror = () => {
          clearTimeout(timer);
          setLoadError(true);
          setLoading(false);
        };
        
        return () => {
          clearTimeout(timer);
          URL.revokeObjectURL(url);
        };
      } catch (e) {
        console.error('预览加载失败:', e);
        setLoadError(true);
        setLoading(false);
      }
    }
  }, [open, app]);

  if (!app) return null;

  const handleOpenInNewTab = () => {
    if (onOpenInNewTab && app) {
      onOpenInNewTab(app);
    }
  };

  const shareUrl = `${window.location.origin}/#/app/${app.id}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-lg flex items-center gap-2">
            <span className="truncate max-w-md">{app.title}</span>
          </DialogTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={handleOpenInNewTab}
          >
            <ExternalLink className="w-4 h-4" />
            新标签打开
          </Button>
        </DialogHeader>
        
        <div className="flex-1 bg-white overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-gray-500">加载中...</p>
              </div>
            </div>
          )}
          
          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center gap-4 text-center px-6">
                <AlertCircle className="w-12 h-12 text-amber-500" />
                <div>
                  <p className="text-gray-700 font-medium mb-1">预览加载失败</p>
                  <p className="text-gray-500 text-sm mb-4">该应用包含复杂内容，建议在独立页面中打开</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleOpenInNewTab}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    新标签页打开
                  </Button>
                  <Button variant="outline" onClick={() => window.open(shareUrl, '_blank')}>
                    复制链接打开
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            title={app.title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
