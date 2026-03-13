import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Share2, 
  QrCode, 
  Play, 
  Edit2, 
  Trash2, 
  Copy,
  Check
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { AppItem } from '@/types/app';

interface AppCardProps {
  app: AppItem;
  onPreview: (app: AppItem) => void;
  onShare: (app: AppItem) => void;
  onQrCode: (app: AppItem) => void;
  onEdit: (app: AppItem) => void;
  onDelete: (app: AppItem) => void;
}

export function AppCard({ app, onPreview, onShare, onQrCode, onEdit, onDelete }: AppCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#/app/${app.id}`;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200">
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {/* 缩略图 */}
        {app.thumbnail ? (
          <img
            src={app.thumbnail}
            alt={app.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl">🚀</div>
          </div>
        )}
        
        {/* 悬浮操作层 */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onPreview(app)}
            className="gap-1"
          >
            <Play className="w-4 h-4" />
            预览
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onShare(app)}
            className="gap-1"
          >
            <Share2 className="w-4 h-4" />
            分享
          </Button>
        </div>

        {/* 更多操作菜单 */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPreview(app)}>
                <Play className="w-4 h-4 mr-2" />
                预览
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onShare(app)}>
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onQrCode(app)}>
                <QrCode className="w-4 h-4 mr-2" />
                二维码
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(app)}>
                <Edit2 className="w-4 h-4 mr-2" />
                编辑
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(app)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate" title={app.title}>
              {app.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2" title={app.description}>
              {app.description || '暂无描述'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{formatDate(app.createdAt)}</span>
            {app.shareCount > 0 && (
              <span className="flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                {app.shareCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopyLink}
              title="复制链接"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onQrCode(app)}
              title="生成二维码"
            >
              <QrCode className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
