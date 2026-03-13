import { useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useState } from 'react';
import type { AppItem } from '@/types/app';

interface QrCodeDialogProps {
  app: AppItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QrCodeDialog({ app, open, onOpenChange }: QrCodeDialogProps) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!app) return null;

  const shareUrl = `${window.location.origin}/#/app/${app.id}`;

  const handleDownload = async () => {
    if (qrRef.current) {
      const dataUrl = await toPng(qrRef.current);
      const link = document.createElement('a');
      link.download = `${app.name}-qrcode.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            二维码分享
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <div 
            ref={qrRef}
            className="p-6 bg-white rounded-xl shadow-lg border-2 border-gray-100"
          >
            <QRCodeSVG
              value={shareUrl}
              size={220}
              level="H"
              includeMargin={false}
              imageSettings={app.thumbnail ? {
                src: app.thumbnail,
                height: 50,
                width: 50,
                excavate: true,
              } : undefined}
            />
          </div>

          <div className="mt-4 text-center">
            <h4 className="font-semibold text-gray-900">{app.title}</h4>
            <p className="text-sm text-gray-500 mt-1">扫描二维码访问应用</p>
          </div>

          <div className="flex gap-2 mt-6 w-full">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              复制链接
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4" />
              下载二维码
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
