"use client";

/**
 * 主应用组件 - Client Component
 */

import { useState } from "react";
import type { GenerateResponse, UIState } from "@/types/api";
import { generateInsights, APIError } from "@/lib/api-client";
import { ResultsPane } from "./results-pane";
import { ComposerBar } from "./composer-bar";

export function MainApp() {
  const [state, setState] = useState<UIState>("idle");
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(
    null
  );
  const [topic, setTopic] = useState("");
  const [shouldClearInput, setShouldClearInput] = useState(false);

  const handleGenerate = async (inputTopic: string) => {
    // 验证输入
    const trimmedTopic = inputTopic.trim();
    if (!trimmedTopic || trimmedTopic.length < 2) {
      setError({
        code: "BAD_REQUEST",
        message: "主题至少需要 2 个字符",
      });
      setState("error");
      return;
    }

    if (trimmedTopic.length > 120) {
      setError({
        code: "BAD_REQUEST",
        message: "主题不能超过 120 个字符",
      });
      setState("error");
      return;
    }

    // 开始生成
    setState("loading");
    setError(null);
    setTopic(trimmedTopic);
    setShouldClearInput(false);

    try {
      const result = await generateInsights(trimmedTopic);
      setResponse(result);
      setState("success");

      // 成功后清空输入框
      setShouldClearInput(true);

      // 滚动到顶部显示结果
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } catch (err) {
      if (err instanceof APIError) {
        setError({
          code: err.code,
          message: err.message,
        });
      } else {
        setError({
          code: "UNKNOWN_ERROR",
          message: "发生未知错误",
        });
      }
      setState("error");
    }
  };

  const handleRetry = () => {
    if (topic) {
      handleGenerate(topic);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 头部标题 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            TikTok Creator Insight Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            将模糊的创作意图转化为结构化、可执行的视频脚本
          </p>
        </div>
      </header>

      {/* 结果展示区域 */}
      <div className="flex-1 overflow-y-auto pb-32">
        <ResultsPane
          state={state}
          response={response}
          error={error}
          onRetry={handleRetry}
        />
      </div>

      {/* 输入栏（固定在底部） */}
      <ComposerBar
        onGenerate={handleGenerate}
        disabled={state === "loading"}
        shouldClear={shouldClearInput}
        onCleared={() => setShouldClearInput(false)}
      />
    </div>
  );
}
