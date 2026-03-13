import { useState, useEffect, useCallback } from 'react';
import type { AppItem } from '@/types/app';
import { demoApp } from '@/data/demoApp';

const STORAGE_KEY = 'my-app-library';

export function useAppStorage() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // 从localStorage加载应用
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // 如果没有应用，添加演示应用
        if (parsed.length === 0) {
          setApps([demoApp]);
        } else {
          setApps(parsed);
        }
      } catch (e) {
        console.error('Failed to parse stored apps:', e);
        setApps([demoApp]);
      }
    } else {
      // 首次访问，添加演示应用
      setApps([demoApp]);
    }
    setLoaded(true);
  }, []);

  // 保存到localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    }
  }, [apps, loaded]);

  // 添加应用
  const addApp = useCallback((app: Omit<AppItem, 'id' | 'createdAt' | 'updatedAt' | 'shareCount'>) => {
    const newApp: AppItem = {
      ...app,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      shareCount: 0,
    };
    setApps(prev => [newApp, ...prev]);
    return newApp.id;
  }, []);

  // 更新应用
  const updateApp = useCallback((id: string, updates: Partial<AppItem>) => {
    setApps(prev => prev.map(app => 
      app.id === id 
        ? { ...app, ...updates, updatedAt: Date.now() }
        : app
    ));
  }, []);

  // 删除应用
  const deleteApp = useCallback((id: string) => {
    setApps(prev => prev.filter(app => app.id !== id));
  }, []);

  // 获取单个应用
  const getApp = useCallback((id: string) => {
    return apps.find(app => app.id === id);
  }, [apps]);

  // 增加分享计数
  const incrementShareCount = useCallback((id: string) => {
    setApps(prev => prev.map(app => 
      app.id === id 
        ? { ...app, shareCount: app.shareCount + 1 }
        : app
    ));
  }, []);

  return {
    apps,
    loaded,
    addApp,
    updateApp,
    deleteApp,
    getApp,
    incrementShareCount,
  };
}
