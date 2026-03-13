import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-gray-200 mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">页面未找到</h1>
        <p className="text-gray-600 mb-6">
          您访问的页面不存在或已被删除
        </p>
        <Link href="/" className="btn-primary">
          返回首页
        </Link>
      </div>
    </div>
  )
}
