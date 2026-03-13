import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MiniWeb Host - HTML应用托管平台',
  description: '一键托管您的HTML应用，支持微信分享，预览和管理',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
