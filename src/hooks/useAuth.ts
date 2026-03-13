import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured] = useState(isSupabaseConfigured());

  useEffect(() => {
    if (!configured || !supabase) {
      setLoading(false);
      return;
    }

    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!configured) throw new Error('Supabase未配置');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, [configured]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!configured) throw new Error('Supabase未配置');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }, [configured]);

  const signOut = useCallback(async () => {
    if (!configured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, [configured]);

  const signInWithGoogle = useCallback(async () => {
    if (!configured) throw new Error('Supabase未配置');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
    return data;
  }, [configured]);

  return {
    user,
    loading,
    configured,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
  };
}
