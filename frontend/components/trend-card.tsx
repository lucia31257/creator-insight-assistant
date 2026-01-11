"use client";

/**
 * 趋势卡片组件
 */

import type { Trends } from "@/types/api";
import { CopyButton } from "./copy-button";
import { formatTrendsForCopy } from "@/lib/utils";

interface TrendCardProps {
  trends: Trends;
}

export function TrendCard({ trends }: TrendCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 overflow-hidden">
      {/* 卡片头部 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">📊</span>
            趋势推荐
          </h3>
          <CopyButton
            text={formatTrendsForCopy(trends)}
            label="复制"
            variant="secondary"
          />
        </div>
      </div>

      {/* 卡片内容 */}
      <div className="p-6 space-y-6">
        {/* 标签 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🏷️</span>
            <h4 className="font-semibold text-gray-800">推荐标签</h4>
          </div>
          <div className="flex flex-wrap gap-2 pl-8">
            {trends.hashtags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full font-medium hover:from-purple-200 hover:to-pink-200 transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 音乐风格 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🎵</span>
            <h4 className="font-semibold text-gray-800">音乐风格</h4>
          </div>
          <div className="space-y-2 pl-8">
            {trends.music_styles.map((style, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3"
              >
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold rounded-full">
                  {index + 1}
                </span>
                <span className="text-gray-700 font-medium">{style}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
