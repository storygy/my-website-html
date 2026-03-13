import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">MiniWeb Host</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                登录
              </Link>
              <Link href="/register" className="btn-primary">
                立即开始
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              轻松托管您的
              <span className="text-primary-500"> HTML 应用</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              一键上传，即可在微信中分享。支持预览、管理和版本控制，让您的 HTML 项目展示更便捷
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="btn-primary text-lg px-8 py-3">
                立即开始 - 免费使用
              </Link>
              <Link href="/login" className="btn-secondary text-lg px-8 py-3">
                已有账号？登录
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              核心功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">一键上传</h3>
                <p className="text-gray-600">
                  只需拖拽或选择您的 HTML 文件，即可快速托管。支持单个 HTML 文件或包含资源文件的文件夹
                </p>
              </div>

              {/* Feature 2 */}
              <div className="card text-center">
                <div className="w-16 h-16 bg-success-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">微信分享</h3>
                <p className="text-gray-600">
                  生成专属链接，复制即可分享。微信内置浏览器完美兼容，二维码扫码即用
                </p>
              </div>

              {/* Feature 3 */}
              <div className="card text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">应用管理</h3>
                <p className="text-gray-600">
                  在个人仪表盘中管理所有应用。实时预览、编辑名称、删除应用，一切尽在掌握
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              使用流程
            </h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">注册账号</h4>
                  <p className="text-gray-600 text-sm">使用邮箱快速注册</p>
                </div>
              </div>
              <div className="hidden md:block text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">上传 HTML</h4>
                  <p className="text-gray-600 text-sm">拖拽或选择文件上传</p>
                </div>
              </div>
              <div className="hidden md:block text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">获取链接</h4>
                  <p className="text-gray-600 text-sm">一键复制分享链接</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-24 text-center">
            <div className="card max-w-2xl mx-auto py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                准备好开始了吗？
              </h2>
              <p className="text-gray-600 mb-6">
                立即注册，开始托管您的 HTML 应用
              </p>
              <Link href="/register" className="btn-primary text-lg px-8 py-3 inline-block">
                立即注册
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold">MiniWeb Host</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} MiniWeb Host. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
