import { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image, FileCode, X } from 'lucide-react';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (data: {
    name: string;
    title: string;
    description: string;
    thumbnail: string | null;
    htmlContent: string;
  }) => void;
}

export function UploadDialog({ open, onOpenChange, onUpload }: UploadDialogProps) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const htmlInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName('');
    setTitle('');
    setDescription('');
    setThumbnail(null);
    setHtmlContent('');
  };

  const handleHtmlFileChange = (file: File) => {
    if (file.type === 'text/html' || file.name.endsWith('.html')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setHtmlContent(content);
        // 尝试从HTML中提取title
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        if (titleMatch && !title) {
          setTitle(titleMatch[1]);
        }
        // 使用文件名作为默认名称
        if (!name) {
          setName(file.name.replace('.html', ''));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImageFileChange = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnail(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type === 'text/html' || file.name.endsWith('.html')) {
        handleHtmlFileChange(file);
      } else if (file.type.startsWith('image/')) {
        handleImageFileChange(file);
      }
    });
  }, [title, name]);

  const handleSubmit = () => {
    if (!name.trim() || !htmlContent.trim()) return;
    
    onUpload({
      name: name.trim(),
      title: title.trim() || name.trim(),
      description: description.trim(),
      thumbnail,
      htmlContent,
    });
    
    resetForm();
    onOpenChange(false);
  };

  const canSubmit = name.trim() && htmlContent.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            上传应用
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 拖拽上传区域 */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-xl p-8 text-center transition-colors
              ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
              ${htmlContent ? 'bg-green-50 border-green-400' : ''}
            `}
          >
            <FileCode className={`w-12 h-12 mx-auto mb-3 ${htmlContent ? 'text-green-500' : 'text-gray-400'}`} />
            <p className="text-sm text-gray-600 mb-2">
              {htmlContent ? 'HTML文件已加载' : '拖拽HTML文件到此处，或点击选择'}
            </p>
            <input
              ref={htmlInputRef}
              type="file"
              accept=".html,.htm,text/html"
              onChange={(e) => e.target.files?.[0] && handleHtmlFileChange(e.target.files[0])}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => htmlInputRef.current?.click()}
            >
              选择HTML文件
            </Button>
          </div>

          {/* 应用信息 */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">应用名称 *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="给应用起个名字"
              />
            </div>

            <div>
              <Label htmlFor="title">分享标题</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="分享到微信时显示的标题"
              />
            </div>

            <div>
              <Label htmlFor="description">分享描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="分享到微信时显示的描述"
                rows={3}
              />
            </div>

            {/* 缩略图上传 */}
            <div>
              <Label>分享配图</Label>
              <div className="mt-2">
                {thumbnail ? (
                  <div className="relative inline-block">
                    <img
                      src={thumbnail}
                      alt="Thumbnail"
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setThumbnail(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <Image className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">点击上传</span>
                  </div>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageFileChange(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            上传应用
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
