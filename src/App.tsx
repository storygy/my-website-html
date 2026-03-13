import { useState, useEffect, useCallback } from 'react';
import { Plus, Grid, List, Search, Share2, Code2, Sparkles, Cloud, CloudOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCloudStorage } from '@/hooks/useCloudStorage';
import { UploadDialog } from '@/components/UploadDialog';
import { AppCard } from '@/components/AppCard';
import { ShareDialog } from '@/components/ShareDialog';
import { PreviewDialog } from '@/components/PreviewDialog';
import { EditDialog } from '@/components/EditDialog';
import { DeleteDialog } from '@/components/DeleteDialog';
import { QrCodeDialog } from '@/components/QrCodeDialog';
import { AuthDialog } from '@/components/AuthDialog';
import { UserMenu } from '@/components/UserMenu';
import { AppViewer } from '@/components/AppViewer';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { AppItem } from '@/types/app';
import './App.css';

// 简单的路由钩子
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((newHash: string) => {
    window.location.hash = newHash;
  }, []);

  return { hash, navigate };
}

function App() {
  const { hash, navigate } = useHashRoute();
  const { user, loading: authLoading, configured: authConfigured, signIn, signUp, signOut, signInWithGoogle } = useAuth();
  const { apps, loaded, syncing, lastSync, error: syncError, addApp, updateApp, deleteApp, getApp, incrementShareCount, sync } = useCloudStorage({ 
    user, 
    enabled: authConfigured && !!user 
  });
  
  // UI状态
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // 对话框状态
  const [shareApp, setShareApp] = useState<AppItem | null>(null);
  const [previewApp, setPreviewApp] = useState<AppItem | null>(null);
  const [editApp, setEditApp] = useState<AppItem | null>(null);
  const [deleteAppItem, setDeleteAppItem] = useState<AppItem | null>(null);
  const [qrCodeApp, setQrCodeApp] = useState<AppItem | null>(null);

  // 解析路由
  const route = hash.replace('#/', '').split('/');
  const isAppRoute = route[0] === 'app' && route[1];
  const currentAppId = isAppRoute ? route[1] : null;
  const currentApp = currentAppId ? getApp(currentAppId) : null;

  // 如果是应用路由，显示应用内容
  if (isAppRoute && currentApp) {
    return <AppViewer app={currentApp} />;
  }

  // 如果应用不存在，显示404
  if (isAppRoute && !currentApp && loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">应用未找到</h1>
          <p className="text-gray-500 mb-6">该应用可能已被删除或链接无效</p>
          <Button onClick={() => navigate('')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  // 过滤应用
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 处理上传
  const handleUpload = (data: {
    name: string;
    title: string;
    description: string;
    thumbnail: string | null;
    htmlContent: string;
  }) => {
    addApp(data);
  };

  // 处理分享
  const handleShare = (app: AppItem) => {
    setShareApp(app);
    incrementShareCount(app.id);
  };

  // 处理在新标签页打开
  const handleOpenInNewTab = (app: AppItem) => {
    const url = `${window.location.origin}/#/app/${app.id}`;
    window.open(url, '_blank');
  };

  // 处理微信分享
  const handleShareWechat = () => {
    if (navigator.share) {
      navigator.share({
        title: shareApp?.title || '',
        text: shareApp?.description || '',
        url: `${window.location.origin}/#/app/${shareApp?.id}`,
      }).catch(() => {});
    }
  };

  // 处理登录
  const handleLogin = async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signIn(email, password);
    } catch (e: any) {
      setAuthError(e.message);
      throw e;
    }
  };

  // 处理注册
  const handleRegister = async (email: string, password: string) => {
    setAuthError(null);
    try {
      await signUp(email, password);
    } catch (e: any) {
      setAuthError(e.message);
      throw e;
    }
  };

  // 处理Google登录
  const handleGoogleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (e: any) {
      setAuthError(e.message);
      throw e;
    }
  };

  // 处理退出登录
  const handleLogout = async () => {
    await signOut();
  };

  if (!loaded || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  我的应用库
                </h1>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  管理和分享你的HTML应用
                  {supabaseConfigured && user && (
                    <Badge variant="outline" className="text-xs gap-1 ml-1">
                      <Cloud className="w-3 h-3" />
                      已同步
                    </Badge>
                  )}
                  {supabaseConfigured && !user && (
                    <Badge variant="outline" className="text-xs gap-1 ml-1 text-amber-600 border-amber-300">
                      <CloudOff className="w-3 h-3" />
                      未登录
                    </Badge>
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setUploadOpen(true)}
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="w-4 h-4" />
                上传应用
              </Button>
              
              {supabaseConfigured && (
                <UserMenu
                  user={user}
                  syncing={syncing}
                  lastSync={lastSync}
                  onLogin={() => setAuthOpen(true)}
                  onLogout={handleLogout}
                  onSync={sync}
                />
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 配置提示 */}
        {!supabaseConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <CloudOff className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900">后端服务未配置</h3>
                <p className="text-sm text-amber-700 mt-1">
                  当前数据仅存储在本地浏览器中。如需跨设备同步，请配置 Supabase 后端服务。
                </p>
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  了解如何配置 Supabase →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 同步错误提示 */}
        {syncError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <CloudOff className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">同步失败</h3>
                <p className="text-sm text-red-700 mt-1">{syncError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">应用总数</p>
                <p className="text-3xl font-bold text-gray-900">{apps.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Grid className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">总分享次数</p>
                <p className="text-3xl font-bold text-gray-900">
                  {apps.reduce((sum, app) => sum + app.shareCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Share2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">最近更新</p>
                <p className="text-lg font-semibold text-gray-900">
                  {apps.length > 0 
                    ? new Date(Math.max(...apps.map(a => a.updatedAt))).toLocaleDateString('zh-CN')
                    : '-'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索应用..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
              <TabsList>
                <TabsTrigger value="grid" className="gap-1">
                  <Grid className="w-4 h-4" />
                  网格
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-1">
                  <List className="w-4 h-4" />
                  列表
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Apps Grid/List */}
        {filteredApps.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onPreview={setPreviewApp}
                onShare={handleShare}
                onQrCode={setQrCodeApp}
                onEdit={setEditApp}
                onDelete={setDeleteAppItem}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? '没有找到匹配的应用' : '还没有应用'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? '尝试使用其他关键词搜索' 
                : '点击右上角的上传按钮，添加你的第一个HTML应用'}
            </p>
            {!searchQuery && (
              <Button onClick={() => setUploadOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                上传应用
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Dialogs */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
      />

      <ShareDialog
        app={shareApp}
        open={!!shareApp}
        onOpenChange={(open) => !open && setShareApp(null)}
        onShareWechat={handleShareWechat}
      />

      <PreviewDialog
        app={previewApp}
        open={!!previewApp}
        onOpenChange={(open) => !open && setPreviewApp(null)}
        onOpenInNewTab={handleOpenInNewTab}
      />

      <EditDialog
        app={editApp}
        open={!!editApp}
        onOpenChange={(open) => !open && setEditApp(null)}
        onSave={updateApp}
      />

      <DeleteDialog
        app={deleteAppItem}
        open={!!deleteAppItem}
        onOpenChange={(open) => !open && setDeleteAppItem(null)}
        onConfirm={deleteApp}
      />

      <QrCodeDialog
        app={qrCodeApp}
        open={!!qrCodeApp}
        onOpenChange={(open) => !open && setQrCodeApp(null)}
      />

      {supabaseConfigured && (
        <AuthDialog
          open={authOpen}
          onOpenChange={setAuthOpen}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onGoogleLogin={handleGoogleLogin}
          error={authError}
          loading={authLoading}
        />
      )}
    </div>
  );
}

export default App;
