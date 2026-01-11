'use client'

/**
 * 状态卡片组件（Loading / Error）
 */

import { getErrorMessage } from '@/lib/utils'

interface StatusCardProps {
  type: 'loading' | 'error'
  error?: { code: string; message: string }
  onRetry?: () => void
}

export function StatusCard({ type, error, onRetry }: StatusCardProps) {
  if (type === 'loading') {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* 加载动画 */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              AI 正在为您生成创意内容...
            </h3>
            <p className="text-gray-600">
              这可能需要几秒钟时间，请稍候
            </p>
          </div>

          {/* 加载提示 */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['分析主题', '生成脚本', '推荐趋势'].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-2 px-3 py-1 bg-purple-50 rounded-full text-sm text-purple-700"
                style={{
                  animation: `pulse 1.5s ease-in-out ${index * 0.3}s infinite`,
                }}
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error 状态
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-red-200">
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* 错误图标 */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            生成失败
          </h3>
          {error && (
            <div className="space-y-2">
              <p className="text-red-600 font-medium">
                {getErrorMessage(error.code, error.message)}
              </p>
              <p className="text-sm text-gray-500">
                错误码: {error.code}
              </p>
            </div>
          )}
        </div>

        {/* 重试按钮 */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            重试
          </button>
        )}
      </div>
    </div>
  )
}
