import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Copy, 
  Check, 
  Share2, 
  MessageCircle, 
  Link2,
  Download,
  ExternalLink
} from 'lucide-react';
import { toPng } from 'html-to-image';
import type { AppItem } from '@/types/app';

interface ShareDialogProps {
  app: AppItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShareWechat?: () => void;
}

export function ShareDialog({ app, open, onOpenChange, onShareWechat }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('link');
  const qrRef = useRef<HTMLDivElement>(null);

  if (!app) return null;

  const shareUrl = `${window.location.origin}/#/app/${app.id}`;
  const shareTitle = app.title || app.name;
  const shareDesc = app.description || '来看看这个有趣的应用吧！';

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyFullShare = async () => {
    const text = `${shareTitle}\n${shareDesc}\n${shareUrl}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = async () => {
    if (qrRef.current) {
      try {
        const dataUrl = await toPng(qrRef.current);
        const link = document.createElement('a');
        link.download = `${app.name}-qrcode.png`;
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.error('下载二维码失败:', e);
      }
    }
  };

  const handleShareWechat = () => {
    if (onShareWechat) {
      onShareWechat();
    }
  };

  const handleOpenLink = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            分享应用
          </DialogTitle>
        </DialogHeader>

        {/* 应用信息预览 */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            {app.thumbnail ? (
              <img 
                src={app.thumbnail} 
                alt={app.title}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                🚀
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{shareTitle}</h4>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">{shareDesc}</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link" className="gap-1 text-xs sm:text-sm">
              <Link2 className="w-4 h-4" />
              链接
            </TabsTrigger>
            <TabsTrigger value="qrcode" className="gap-1 text-xs sm:text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              二维码
            </TabsTrigger>
            <TabsTrigger value="wechat" className="gap-1 text-xs sm:text-sm">
              <MessageCircle className="w-4 h-4" />
              微信
            </TabsTrigger>
          </TabsList>

          {/* 链接分享 */}
          <TabsContent value="link" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm">分享链接</Label>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="flex-1 text-xs sm:text-sm" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                  className="shrink-0"
                  title="复制链接"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleOpenLink}
                  className="shrink-0"
                  title="打开链接"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">完整分享文本</Label>
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 border">
                <p className="font-medium">{shareTitle}</p>
                <p className="text-gray-500 mt-1">{shareDesc}</p>
                <p className="text-blue-500 mt-1 break-all text-xs">{shareUrl}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={handleCopyFullShare}
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                复制完整分享文本
              </Button>
            </div>
          </TabsContent>

          {/* 二维码分享 */}
          <TabsContent value="qrcode" className="space-y-4 mt-4">
            <div className="flex flex-col items-center">
              <div 
                ref={qrRef}
                className="p-4 bg-white rounded-xl shadow-sm border"
              >
                <QRCodeSVG
                  value={shareUrl}
                  size={180}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">
                扫描二维码即可访问应用
              </p>
              <Button 
                variant="outline" 
                className="mt-3 gap-2"
                onClick={handleDownloadQr}
              >
                <Download className="w-4 h-4" />
                下载二维码
              </Button>
            </div>
          </TabsContent>

          {/* 微信分享 */}
          <TabsContent value="wechat" className="space-y-4 mt-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">分享到微信群</h4>
                <p className="text-sm text-gray-500 mt-1">
                  微信转发时会显示以下标题和配图
                </p>
              </div>

              {/* 预览卡片 */}
              <div className="border rounded-lg overflow-hidden bg-white text-left max-w-xs mx-auto">
                {app.thumbnail ? (
                  <img 
                    src={app.thumbnail} 
                    alt={shareTitle}
                    className="w-full h-28 object-cover"
                  />
                ) : (
                  <div className="w-full h-28 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl">🚀</span>
                  </div>
                )}
                <div className="p-3">
                  <p className="font-medium text-gray-900 line-clamp-1 text-sm">{shareTitle}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{shareDesc}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full gap-2 bg-green-500 hover:bg-green-600"
                  onClick={handleShareWechat}
                >
                  <MessageCircle className="w-4 h-4" />
                  分享到微信
                </Button>
                <p className="text-xs text-gray-400">
                  点击后请使用浏览器的分享功能转发到微信
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-left">
                <p className="text-sm text-amber-800">
                  <strong>提示：</strong>如果浏览器支持，可以直接调用系统分享功能。
                  否则请复制链接手动分享到微信。
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
