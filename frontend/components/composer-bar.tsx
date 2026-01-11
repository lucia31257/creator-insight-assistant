"use client";

/**
 * 输入栏组件 - Client Component
 */

import { useState, FormEvent, useEffect } from "react";

interface ComposerBarProps {
  onGenerate: (topic: string) => void;
  disabled: boolean;
  shouldClear?: boolean;
  onCleared?: () => void;
}

export function ComposerBar({
  onGenerate,
  disabled,
  shouldClear,
  onCleared,
}: ComposerBarProps) {
  const [inputValue, setInputValue] = useState("");

  // 监听清空信号
  useEffect(() => {
    if (shouldClear) {
      setInputValue("");
      onCleared?.();
    }
  }, [shouldClear, onCleared]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onGenerate(inputValue);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-20">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入视频主题或创意方向（例如：日本旅行、美食探店、健身教程）"
            disabled={disabled}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-base"
            maxLength={120}
          />
          <button
            type="submit"
            disabled={disabled || !inputValue.trim()}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:hover:shadow-lg"
          >
            {disabled ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                生成中
              </span>
            ) : (
              "生成"
            )}
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500 text-center">
          {inputValue.length}/120 字符
        </div>
      </div>
    </div>
  );
}
