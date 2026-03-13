import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { ViewClient } from './ViewClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ViewPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createClient()

  // Fetch app by ID (public access)
  const { data: app, error } = await supabase
    .from('apps')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !app) {
    notFound()
  }

  // Get public URL for the HTML file
  const { data: { publicUrl } } = supabase.storage
    .from('user-apps')
    .getPublicUrl(app.storage_path)

  return <ViewClient app={app} htmlUrl={publicUrl} />
}
