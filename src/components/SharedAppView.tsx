// SharedAppView.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase'; 

// 定义应用数据类型
interface AppData {
  id: string;
  name: string;
  content: string;
  storage_path?: string;
  created_at: string;
}

export function SharedAppView() {
  const { appId } = useParams<{ appId: string }>();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSharedApp() {
      try {
        setLoading(true);
        
        // 关键查询：只查公开的应用，不附加任何用户条件
        const { data, error } = await supabase
          .from('user_apps')
          .select('*')
          .eq('id', appId)
          .eq('is_public', true)  // 必须标记为公开才能查到
          .single();

        if (error) {
          console.error('查询错误:', error);
          throw new Error('应用不存在或未分享');
        }

        if (!data) {
          throw new Error('应用不存在或未分享');
        }

        setAppData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    }

    if (appId) {
      fetchSharedApp();
    }
  }, [appId]);

  // 加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">出错了</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // 无数据（理论上不会触发，因为有错误处理，但保留安全判断）
  if (!appData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">无此项目</h1>
          <p className="text-gray-600">该应用不存在或尚未分享</p>
        </div>
      </div>
    );
  }

  // 成功：渲染应用内容
  return (
    <div className="shared-app-container">
      {/* 应用标题栏 */}
      <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-800">{appData.name}</h1>
        <span className="text-xs text-gray-500">
          Powered by pdmmcs.cn
        </span>
      </div>
      
      {/* 应用内容 - 这里根据你的存储方式调整 */}
      <div className="app-content">
        {appData.content ? (
          // 方式1：如果 content 字段存的是 HTML 字符串
          <iframe
            srcDoc={appData.content}
            title={appData.name}
            className="w-full h-[calc(100vh-60px)] border-0"
            sandbox="allow-scripts allow-forms allow-same-origin"
          />
        ) : appData.storage_path ? (
          // 方式2：如果文件存在 Storage 中
          <iframe
            src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${appData.storage_path}`}
            title={appData.name}
            className="w-full h-[calc(100vh-60px)] border-0"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
          />
        ) : (
          <div className="p-8 text-center text-gray-500">
            无法加载应用内容
          </div>
        )}
      </div>
    </div>
  );
}