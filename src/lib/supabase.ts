import { createClient } from '@supabase/supabase-js';
import type { AppItem } from '@/types/app';

// 用户需要替换为自己的Supabase配置
// 1. 访问 https://supabase.com 创建免费账户
// 2. 创建新项目
// 3. 在 Project Settings > API 中获取 URL 和 anon key
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// 检查Supabase是否已配置
export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http'));
}

// 只在配置存在时创建客户端
export const supabase = isSupabaseConfigured() 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null as any; // 未配置时返回null，使用时需要检查

// 数据库表名
export const APPS_TABLE = 'user_apps';

// 将AppItem转换为数据库格式
export function toDbFormat(app: AppItem, userId: string) {
  return {
    id: app.id,
    user_id: userId,
    name: app.name,
    title: app.title,
    description: app.description,
    thumbnail: app.thumbnail,
    html_content: app.htmlContent,
    share_count: app.shareCount,
    is_public: app.isPublic || false,  // 👈 添加这一行
    created_at: new Date(app.createdAt).toISOString(),
    updated_at: new Date(app.updatedAt).toISOString(),
  };
}

// 将数据库格式转换为AppItem
export function fromDbFormat(dbApp: any): AppItem {
  return {
    id: dbApp.id,
    name: dbApp.name,
    title: dbApp.title,
    description: dbApp.description || '',
    thumbnail: dbApp.thumbnail,
    htmlContent: dbApp.html_content,
    shareCount: dbApp.share_count || 0,
    isPublic: dbApp.is_public || false,  // 👈 添加这一行
    createdAt: new Date(dbApp.created_at).getTime(),
    updatedAt: new Date(dbApp.updated_at).getTime(),
  };
}