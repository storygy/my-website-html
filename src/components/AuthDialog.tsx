import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Mail, Lock, Chrome } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

export function AuthDialog({ 
  open, 
  onOpenChange, 
  onLogin, 
  onRegister, 
  onGoogleLogin,
  error, 
  loading 
}: AuthDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLocalError(null);
    if (!email || !password) {
      setLocalError('请填写邮箱和密码');
      return;
    }
    try {
      await onLogin(email, password);
      onOpenChange(false);
    } catch (e: any) {
      setLocalError(e.message || '登录失败');
    }
  };

  const handleRegister = async () => {
    setLocalError(null);
    if (!email || !password) {
      setLocalError('请填写邮箱和密码');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('两次输入的密码不一致');
      return;
    }
    if (password.length < 6) {
      setLocalError('密码长度至少为6位');
      return;
    }
    try {
      await onRegister(email, password);
      setActiveTab('login');
      setLocalError('注册成功，请登录');
    } catch (e: any) {
      setLocalError(e.message || '注册失败');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await onGoogleLogin();
    } catch (e: any) {
      setLocalError(e.message || 'Google登录失败');
    }
  };

  const displayError = error || localError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">欢迎使用我的应用库</DialogTitle>
          <DialogDescription className="text-center">
            登录后可实现跨设备数据同步
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">登录</TabsTrigger>
            <TabsTrigger value="register">注册</TabsTrigger>
          </TabsList>

          {displayError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="login-password"
                  type="password"
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">或</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full gap-2"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <Chrome className="w-4 h-4" />
              使用 Google 登录
            </Button>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-email">邮箱</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="register-password"
                  type="password"
                  placeholder="设置密码（至少6位）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-confirm">确认密码</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="register-confirm"
                  type="password"
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? '注册中...' : '注册'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
