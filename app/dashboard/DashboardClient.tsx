'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { User, App } from '@/lib/types'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

interface DashboardClientProps {
  user: User
  initialApps: App[]
}

export function DashboardClient({ user, initialApps }: DashboardClientProps) {
  const [apps, setApps] = useState<App[]>(initialApps)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedApp, setSelectedApp] = useState<App | null>(null)
  const [previewApp, setPreviewApp] = useState<App | null>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareApp, setShareApp] = useState<App | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.html')) {
      alert('请上传 HTML 文件')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Generate unique file path
      const fileExt = 'html'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const storagePath = `${user.id}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-apps')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) {
        throw uploadError
      }

      setUploadProgress(50)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-apps')
        .getPublicUrl(storagePath)

      // Extract title from filename
      const title = file.name.replace('.html', '')

      // Save to database
      const { data: appData, error: dbError } = await supabase
        .from('apps')
        .insert({
          user_id: user.id,
          title,
          storage_path: storagePath,
          original_name: file.name,
        })
        .select()
        .single()

      if (dbError) {
        throw dbError
      }

      setUploadProgress(100)

      // Add to local state
      if (appData) {
        setApps([appData, ...apps])
      }

      // Reset file input
      e.target.value = ''

      setTimeout(() => {
        setUploading(false)
        setUploadProgress(0)
      }, 500)
    } catch (error) {
      console.error('Upload error:', error)
      alert('上传失败，请重试')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = async (appId: string) => {
    try {
      // Get app data
      const app = apps.find(a => a.id === appId)
      if (!app) return

      // Delete from storage
      await supabase.storage
        .from('user-apps')
        .remove([app.storage_path])

      // Delete from database
      await supabase
        .from('apps')
        .delete()
        .eq('id', appId)

      // Update local state
      setApps(apps.filter(a => a.id !== appId))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete error:', error)
      alert('删除失败，请重试')
    }
  }

  const handleUpdateTitle = async (appId: string, newTitle: string) => {
    try {
      await supabase
        .from('apps')
        .update({ title: newTitle })
        .eq('id', appId)

      setApps(apps.map(a => a.id === appId ? { ...a, title: newTitle } : a))
    } catch (error) {
      console.error('Update error:', error)
      alert('更新失败，请重试')
    }
  }

  const copyShareLink = (appId: string) => {
    const url = `${window.location.origin}/view/${appId}`
    navigator.clipboard.writeText(url)
    alert('链接已复制到剪贴板')
  }

  const filteredApps = apps.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPublicUrl = (storagePath: string) => {
    const { data } = supabase.storage
      .from('user-apps')
      .getPublicUrl(storagePath)
    return data.publicUrl
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的应用</h1>
          <p className="text-gray-600 mt-1">管理您的 HTML 应用</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="btn-primary cursor-pointer flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            上传应用
            <input
              type="file"
              accept=".html"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">正在上传...</p>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="搜索应用..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Apps Grid */}
      {filteredApps.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无应用</h3>
          <p className="text-gray-600 mb-4">上传您的第一个 HTML 应用开始使用</p>
          <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            上传应用
            <input
              type="file"
              accept=".html"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div key={app.id} className="card hover:shadow-lg transition-shadow">
              {/* Preview Thumbnail */}
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                <iframe
                  src={getPublicUrl(app.storage_path)}
                  className="w-full h-full"
                  title={app.title}
                  sandbox="allow-same-origin"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              </div>

              {/* App Info */}
              <div className="mb-4">
                <input
                  type="text"
                  value={app.title}
                  onBlur={(e) => handleUpdateTitle(app.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur()
                    }
                  }}
                  className="font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none w-full"
                />
                <p className="text-sm text-gray-500 mt-1">
                  创建于 {new Date(app.created_at).toLocaleDateString('zh-CN')}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewApp(app)}
                  className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  预览
                </button>
                <button
                  onClick={() => {
                    setShareApp(app)
                    setShareModalOpen(true)
                  }}
                  className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  分享
                </button>
                <button
                  onClick={() => setDeleteConfirm(app.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewApp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">{previewApp.title}</h3>
              <button
                onClick={() => setPreviewApp(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-[70vh]">
              <iframe
                src={getPublicUrl(previewApp.storage_path)}
                className="w-full h-full"
                title={previewApp.title}
                sandbox="allow-same-origin allow-scripts"
              />
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && shareApp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">分享应用</h3>
              <button
                onClick={() => setShareModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-600 mb-4">扫描二维码或复制链接分享</p>
              <div className="bg-white p-4 inline-block rounded-lg border">
                <QRCodeSVG
                  value={`${window.location.origin}/view/${shareApp.id}`}
                  size={180}
                  level="H"
                  includeMargin
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="label">分享链接</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/view/${shareApp.id}`}
                    readOnly
                    className="input flex-1"
                  />
                  <button
                    onClick={() => copyShareLink(shareApp.id)}
                    className="btn-primary whitespace-nowrap"
                  >
                    复制
                  </button>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              此链接可以在微信中直接打开
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">确认删除</h3>
              <p className="text-gray-600 mt-1">此操作不可恢复，是否确定删除？</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn-secondary"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 btn-danger"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
