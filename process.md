# 开发复盘

## 项目概述

本项目是一个基于 AI 的 TikTok Creator Insight Assistant，旨在帮助短视频创作者快速生成视频脚本和趋势洞察。

## 使用的工具

### IDE
- **Cursor**：AI 辅助编程 IDE，使用 Composer Mode 进行代码生成
- **版本**：Cursor 最新稳定版
- **主要功能**：通过自然语言 Prompt 生成代码，支持多文件编辑和上下文理解

### AI 模型
- **代码生成**：**Claude Sonnet 4.5**（Anthropic）- 主要用于根据 Spec 生成代码
- **LLM API 调用**：**阿里云百炼平台** - https://bailian.console.aliyun.com/
  - **Qwen-Max**（通义千问）：用于应用运行时生成脚本内容
  - **DeepSeek-V3**（备选）：用于复杂逻辑实现
  - **API 端点**：`https://dashscope.aliyuncs.com/compatible-mode/v1`



## 开发流程复盘



## 遇到的挑战和解决方案

### 关键修正（Crucial Fixes）
