'use client'

/**
 * 脚本卡片组件
 */

import type { Script } from '@/types/api'
import { CopyButton } from './copy-button'
import { formatScriptForCopy } from '@/lib/utils'

interface ScriptCardProps {
  script: Script
  index: number
}

export function ScriptCard({ script, index }: ScriptCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
      {/* 卡片头部 */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full text-white font-bold">
              {index + 1}
            </span>
            <h3 className="text-xl font-bold text-white">{script.title}</h3>
          </div>
          <CopyButton
            text={formatScriptForCopy(script)}
            label="复制"
            variant="secondary"
          />
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="p-6 space-y-4">
        {/* Hook */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🎬</span>
            <h4 className="font-semibold text-gray-800">开场（Hook）</h4>
          </div>
          <p className="text-gray-700 pl-8 bg-purple-50 rounded-lg p-3">
            {script.hook}
          </p>
        </div>

        {/* Narrative */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📝</span>
            <h4 className="font-semibold text-gray-800">核心内容</h4>
          </div>
          <ul className="space-y-2 pl-8">
            {script.narrative.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-gray-700 bg-blue-50 rounded-lg p-3"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-500 text-white text-sm font-semibold rounded-full">
                  {idx + 1}
                </span>
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✨</span>
            <h4 className="font-semibold text-gray-800">行动号召（CTA）</h4>
          </div>
          <p className="text-gray-700 pl-8 bg-pink-50 rounded-lg p-3 font-medium">
            {script.cta}
          </p>
        </div>
      </div>
    </div>
  )
}
