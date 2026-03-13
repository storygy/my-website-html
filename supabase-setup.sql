-- =============================================
-- MiniWeb Host Database Setup (Supabase SQL)
-- =============================================

-- 1. Create apps table
CREATE TABLE IF NOT EXISTS public.apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Users can view their own apps
CREATE POLICY "Users can view their own apps" ON public.apps
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own apps
CREATE POLICY "Users can insert their own apps" ON public.apps
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own apps
CREATE POLICY "Users can update their own apps" ON public.apps
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own apps
CREATE POLICY "Users can delete their own apps" ON public.apps
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Create storage bucket for user apps
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-apps', 'user-apps', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Storage policies - Users can upload their own files
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-apps' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 6. Storage policies - Users can delete their own files
CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'user-apps' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 7. Storage policies - Anyone can view files (public access for sharing)
CREATE POLICY "Anyone can view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-apps');
