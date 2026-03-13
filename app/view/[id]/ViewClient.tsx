'use client'

import { useEffect, useState } from 'react'
import { App } from '@/lib/types'

interface ViewClientProps {
  app: App
  htmlUrl: string
}

export function ViewClient({ app, htmlUrl }: ViewClientProps) {
  const [isWechat, setIsWechat] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Detect WeChat browser
    const ua = navigator.userAgent.toLowerCase()
    const isWechatBrowser = ua.indexOf('micromessenger') > -1
    setIsWechat(isWechatBrowser)

    // Hide loading after iframe loads
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // WeChat browser detection and guidance
  if (isWechat) {
    return (
      <div className="min-h-screen bg-white">
        {/* WeChat Guide */}
        <div className="fixed inset-0 bg-white flex items-center justify-center p-8 z-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              请在外部浏览器中打开
            </h2>
            <p className="text-gray-600 mb-6">
              点击右上角 <span className="text-primary-500 font-medium">···</span> 菜单，选择 <span className="text-primary-500 font-medium">在浏览器中打开</span>
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left max-w-xs mx-auto">
              <p className="text-sm text-gray-600 mb-2">复制链接：</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="flex-1 text-xs bg-white border rounded px-2 py-1"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href)
                    alert('链接已复制')
                  }}
                  className="text-xs bg-primary-500 text-white px-3 py-1 rounded"
                >
                  复制
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsWechat(false)}
              className="mt-6 text-primary-500 text-sm"
            >
              仍然继续访问
            </button>
          </div>
        </div>

        {/* Hidden iframe that will load */}
        <iframe
          src={htmlUrl}
          className="w-full h-screen hidden"
          title={app.title}
          sandbox="allow-same-origin allow-scripts allow-top-navigation"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-40">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">正在加载应用...</p>
          </div>
        </div>
      )}

      {/* Full Screen Iframe */}
      <iframe
        src={htmlUrl}
        className="w-full h-screen border-none"
        title={app.title}
        sandbox="allow-same-origin allow-scripts allow-top-navigation allow-forms"
      />
    </div>
  )
}
