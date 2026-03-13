import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2 } from 'lucide-react';
import type { AppItem } from '@/types/app';

interface DeleteDialogProps {
  app: AppItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (id: string) => void;
}

export function DeleteDialog({ app, open, onOpenChange, onConfirm }: DeleteDialogProps) {
  if (!app) return null;

  const handleConfirm = () => {
    onConfirm(app.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            确认删除
          </DialogTitle>
          <DialogDescription>
            确定要删除应用 <strong>"{app.title}"</strong> 吗？
            <br />
            此操作无法撤销，应用的分享链接也将失效。
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            确认删除
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
