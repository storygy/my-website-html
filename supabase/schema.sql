-- Supabase 数据库表结构
-- 在 Supabase SQL Editor 中执行此脚本

-- 创建用户应用表
CREATE TABLE IF NOT EXISTS user_apps (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    html_content TEXT NOT NULL,
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_user_apps_user_id ON user_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_user_apps_updated_at ON user_apps(updated_at);

-- 启用行级安全策略
ALTER TABLE user_apps ENABLE ROW LEVEL SECURITY;

-- 创建安全策略：用户只能访问自己的数据
CREATE POLICY "Users can only access their own apps" ON user_apps
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_apps_updated_at
    BEFORE UPDATE ON user_apps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
