import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, APPS_TABLE, toDbFormat, fromDbFormat } from '@/lib/supabase';
import { demoApp } from '@/data/demoApp';
import type { AppItem } from '@/types/app';
import type { User } from '@supabase/supabase-js';

const LOCAL_STORAGE_KEY = 'my-app-library';
const SYNC_TIMESTAMP_KEY = 'last-sync-timestamp';
const DEMO_ADDED_KEY = 'demo-app-added-v2';

interface UseCloudStorageOptions {
  user: User | null;
  enabled: boolean;
}

export function useCloudStorage({ user, enabled }: UseCloudStorageOptions) {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 使用ref来跟踪是否已初始化
  const initializedRef = useRef(false);

  // 从本地存储加载
  const loadFromLocal = useCallback((): AppItem[] => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
    return [];
  }, []);

  // 保存到本地存储
  const saveToLocal = useCallback((apps: AppItem[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(apps));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, []);

  // 从云端加载
  const loadFromCloud = useCallback(async (): Promise<AppItem[]> => {
    if (!user || !enabled || !supabase) return [];
    
    try {
      const { data, error } = await supabase
        .from(APPS_TABLE)
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(fromDbFormat);
    } catch (e) {
      console.error('Failed to load from cloud:', e);
      throw e;
    }
  }, [user, enabled]);

  // 同步到云端
  const syncToCloud = useCallback(async (apps: AppItem[]) => {
    if (!user || !enabled || !supabase) return;
    
    setSyncing(true);
    setError(null);
    
    try {
      // 删除用户所有旧数据
      await supabase
        .from(APPS_TABLE)
        .delete()
        .eq('user_id', user.id);
      
      // 插入新数据
      if (apps.length > 0) {
        const dbApps = apps.map(app => toDbFormat(app, user.id));
        const { error } = await supabase
          .from(APPS_TABLE)
          .insert(dbApps);
        
        if (error) throw error;
      }
      
      const now = Date.now();
      localStorage.setItem(SYNC_TIMESTAMP_KEY, now.toString());
      setLastSync(now);
    } catch (e: any) {
      console.error('Failed to sync to cloud:', e);
      setError(e.message || '同步失败');
    } finally {
      setSyncing(false);
    }
  }, [user, enabled]);

  // 初始加载
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const init = async () => {
      const localApps = loadFromLocal();
      
      if (user && enabled) {
        // 已登录，尝试从云端同步
        try {
          const cloudApps = await loadFromCloud();
          
          if (cloudApps.length > 0) {
            // 云端有数据，使用云端数据
            setApps(cloudApps);
            saveToLocal(cloudApps);
          } else if (localApps.length > 0) {
            // 云端无数据，本地有数据，上传到云端
            setApps(localApps);
            await syncToCloud(localApps);
          } else {
            setApps([]);
          }
          
          const lastSyncTime = localStorage.getItem(SYNC_TIMESTAMP_KEY);
          if (lastSyncTime) {
            setLastSync(parseInt(lastSyncTime));
          }
        } catch (e) {
          // 云端加载失败，使用本地数据
          setApps(localApps);
          setError('云端同步失败，使用本地数据');
        }
      } else {
        // 未登录，使用本地数据
        if (localApps.length === 0) {
          // 首次访问，检查是否已添加演示应用
          const demoAdded = localStorage.getItem(DEMO_ADDED_KEY);
          if (!demoAdded) {
            setApps([demoApp]);
            saveToLocal([demoApp]);
            localStorage.setItem(DEMO_ADDED_KEY, 'true');
          } else {
            setApps([]);
          }
        } else {
          setApps(localApps);
        }
      }
      
      setLoaded(true);
    };

    init();
  }, [user, enabled, loadFromLocal, loadFromCloud, saveToLocal, syncToCloud]);

  // 保存到本地和云端
  const saveApps = useCallback(async (newApps: AppItem[] | ((prev: AppItem[]) => AppItem[])) => {
    setApps(prev => {
      const updated = typeof newApps === 'function' ? newApps(prev) : newApps;
      saveToLocal(updated);
      
      // 如果已登录，同步到云端
      if (user && enabled) {
        syncToCloud(updated);
      }
      
      return updated;
    });
  }, [user, enabled, saveToLocal, syncToCloud]);

  // 添加应用
  const addApp = useCallback((app: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt' | 'shareCount'>) => {
    const newApp: AppItem = {
      ...app,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      shareCount: 0,
    };
    
    saveApps(prev => [newApp, ...prev]);
    return newApp.id;
  }, [saveApps]);

  // 更新应用
  const updateApp = useCallback((id: string, updates: Partial<AppItem>) => {
    saveApps(prev => prev.map(app => 
      app.id === id 
        ? { ...app, ...updates, updatedAt: Date.now() }
        : app
    ));
  }, [saveApps]);

  // 删除应用
  const deleteApp = useCallback((id: string) => {
    saveApps(prev => prev.filter(app => app.id !== id));
  }, [saveApps]);

  // 获取单个应用
  const getApp = useCallback((id: string) => {
    return apps.find(app => app.id === id);
  }, [apps]);

  // 增加分享计数
  const incrementShareCount = useCallback((id: string) => {
    saveApps(prev => prev.map(app => 
      app.id === id 
        ? { ...app, shareCount: app.shareCount + 1 }
        : app
    ));
  }, [saveApps]);

  // 手动同步
  const sync = useCallback(async () => {
    if (!user || !enabled) return;
    
    setSyncing(true);
    setError(null);
    
    try {
      // 从云端获取最新数据
      const cloudApps = await loadFromCloud();
      
      // 合并本地和云端数据（以更新时间较新的为准）
      const localApps = loadFromLocal();
      const mergedApps = mergeApps(localApps, cloudApps);
      
      setApps(mergedApps);
      saveToLocal(mergedApps);
      await syncToCloud(mergedApps);
      
      const now = Date.now();
      localStorage.setItem(SYNC_TIMESTAMP_KEY, now.toString());
      setLastSync(now);
    } catch (e: any) {
      setError(e.message || '同步失败');
    } finally {
      setSyncing(false);
    }
  }, [user, enabled, loadFromCloud, loadFromLocal, saveToLocal, syncToCloud]);

  return {
    apps,
    loaded,
    syncing,
    lastSync,
    error,
    addApp,
    updateApp,
    deleteApp,
    getApp,
    incrementShareCount,
    sync,
  };
}

// 合并本地和云端应用，以更新时间较新的为准
function mergeApps(localApps: AppItem[], cloudApps: AppItem[]): AppItem[] {
  const appMap = new Map<string, AppItem>();
  
  // 先添加所有本地应用
  localApps.forEach(app => {
    appMap.set(app.id, app);
  });
  
  // 合并云端应用
  cloudApps.forEach(cloudApp => {
    const localApp = appMap.get(cloudApp.id);
    if (!localApp || cloudApp.updatedAt > localApp.updatedAt) {
      appMap.set(cloudApp.id, cloudApp);
    }
  });
  
  // 按更新时间排序
  return Array.from(appMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
}
