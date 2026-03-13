import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user's apps
  const { data: apps } = await supabase
    .from('apps')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return <DashboardClient user={user} initialApps={apps || []} />
}
