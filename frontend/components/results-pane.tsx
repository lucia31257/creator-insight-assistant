'use client'

/**
 * 结果展示区域组件 - Client Component
 */

import type { GenerateResponse, UIState } from '@/types/api'
import { ScriptCard } from './script-card'
import { TrendCard } from './trend-card'
import { StatusCard } from './status-card'
import { CopyButton } from './copy-button'
import { formatAllResultsForCopy } from '@/lib/utils'

interface ResultsPaneProps {
  state: UIState
  response: GenerateResponse | null
  error: { code: string; message: string } | null
  onRetry: () => void
}

export function ResultsPane({ state, response, error, onRetry }: ResultsPaneProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Idle 状态 */}
      {state === 'idle' && (
        <div className="text-center py-20">
          <div className="inline-block p-6 bg-white/50 backdrop-blur-sm rounded-3xl shadow-lg">
            <svg
              className="w-24 h-24 mx-auto text-purple-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              开始创作之旅
            </h2>
            <p className="text-gray-600">
              在下方输入框中输入您的视频主题，AI 将为您生成创意脚本和趋势洞察
            </p>
          </div>
        </div>
      )}

      {/* Loading 状态 */}
      {state === 'loading' && <StatusCard type="loading" />}

      {/* Error 状态 */}
      {state === 'error' && error && (
        <StatusCard type="error" error={error} onRetry={onRetry} />
      )}

      {/* Success 状态 */}
      {state === 'success' && response && (
        <div className="space-y-6">
          {/* 主题标题 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-purple-100">
            <h2 className="text-xl font-semibold text-gray-800">
              主题：<span className="text-purple-600">{response.topic}</span>
            </h2>
          </div>

          {/* 脚本卡片 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
              视频脚本方案
            </h3>
            {response.scripts.map((script, index) => (
              <ScriptCard key={index} script={script} index={index} />
            ))}
          </div>

          {/* 趋势卡片 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></span>
              趋势洞察
            </h3>
            <TrendCard trends={response.trends} />
          </div>

          {/* 复制全部按钮 */}
          <div className="flex justify-center pt-4">
            <CopyButton
              text={formatAllResultsForCopy(response)}
              label="复制全部内容"
              variant="primary"
            />
          </div>
        </div>
      )}
    </div>
  )
}
