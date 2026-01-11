# TikTok Creator Insight Assistant (MVP)

## 规范驱动开发技术规格说明

---

## 1. 产品愿景

### 1.1 背景与痛点

在短视频生态系统中，创作者经常面临以下问题：

- 创意枯竭（创作瓶颈）
- 与当前趋势脱节
- 由于手动主题研究和非结构化头脑风暴导致的发布周期长

### 1.2 价值主张

构建一个"TikTok Creator Insight Assistant" MVP，实现：

- 将模糊的创作意图转化为结构化、可执行的视频脚本
- 提供符合趋势的标签和背景音乐指导
- 实现数据驱动的创意，显著减少构思时间

### 1.3 MVP 范围

- 多语言主题输入（中文 / 英文）
- 脚本大纲生成（3 个不同风格）
- 趋势推荐（标签 + 音乐风格）
- 生成方案基于结构化卡片的 UI，包含加载、错误处理和复制功能
- 可在本地端到端运行

### 1.4 非目标

- 用户认证
- 历史存储
- 实时 TikTok 趋势爬取
- 多轮对话或个性化

---

## 2. 用户故事（User Story）

### US-1 输入

作为创作者，我可以输入一个模糊的主题或内容方向（中文或英文）。

### US-2 脚本生成

作为创作者，我可以收到 3 个风格不同的短视频脚本结构，每种包含：

- Hook（黄金 3 秒）
- 核心叙述
- Call to Action

### US-3 趋势洞察

作为创作者，我可以收到：

- 5–10 个相关的高潜力标签
- 2–4 个推荐的背景音乐风格描述

### US-4 结构化展示

作为创作者，我可以以结构化卡片形式查看所有生成结果，而不是原始文本。

### US-5 交互与反馈

作为创作者，我可以：

- 在生成过程中看到加载指示器
- 在失败时看到清晰的错误消息
- 一键复制任何脚本或所有结果

---

## 3. 系统架构

### 3.1 前端（Next.js 16/ React）

职责：

- 主题输入 UI
- 验证
- API 调用
- 卡片渲染
- 加载 / 错误 / 复制交互

禁止：

- 存储或访问任何 LLM API 密钥

前端技术约束：

- 必须使用 Next.js 16（App Router），不使用 Pages Router
- 所有页面组件放置在 app/ 目录下

### 3.2 后端（FastAPI / Python）

职责：

- 调用阿里云百炼 LLM（DeepSeek-V3 / Qwen-Max）
- 使用环境变量（.env）读取 API Key，严禁在代码库中硬编码任何密钥
- 通过 HTTP 客户端向百炼 API 发送请求，设置超时与重试策略
- 强制执行模型输出为符合约定 Schema 的 JSON 格式（无 Markdown、无附加文本）
- 若解析失败或违反 Schema，使用“修复提示（repair prompt）”重试一次
- 若修复后仍无效，返回明确的错误码（如 LLM_BAD_OUTPUT）
- 将最终结构化响应（或结构化错误）返回给前端

### 3.3 关注点分离

前端：

```text

localhost:3000  →  POST /api/generate  →  后端

```

后端：

```text

localhost:8000  →  阿里云百炼 LLM

```

### 3.4 项目目录结构（Project Structure）

本项目采用前后端分离结构，代码组织如下：

```text
creator-insight-assistant/
├── frontend/                    # Next.js 16 + React 19 前端
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # 根布局（全局样式、字体、元数据）
│   │   ├── page.tsx            # 主页面（Server Component）
│   │   └── globals.css         # Tailwind CSS 全局样式
│   ├── components/              # React 组件
│   │   ├── composer-bar.tsx    # 输入栏组件（Client Component）
│   │   ├── results-pane.tsx    # 结果展示区（Client Component）
│   │   ├── script-card.tsx     # 脚本卡片组件
│   │   ├── trend-card.tsx      # 趋势卡片组件
│   │   ├── copy-button.tsx     # 复制按钮组件
│   │   └── status-card.tsx     # 状态卡片（Loading/Error）
│   ├── lib/                     # 工具函数与 API 客户端
│   │   ├── api-client.ts       # 后端 API 调用封装
│   │   └── utils.ts            # 通用工具函数
│   ├── types/                   # TypeScript 类型定义
│   │   └── api.ts              # API 请求/响应类型
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts      # Tailwind CSS 配置
│   ├── postcss.config.js       # PostCSS 配置
│   └── next.config.js          # Next.js 配置
├── backend/                     # FastAPI + Python 后端
│   ├── main.py                 # FastAPI 应用入口
│   ├── models.py               # Pydantic 数据模型
│   ├── llm_client.py           # LLM 客户端封装
│   ├── config.py               # 配置管理
│   └── requirements.txt        # Python 依赖
├── spec.md                      # 项目规范文档（本文件）
├── README.md                    # 项目说明与运行指南
├── process.md                   # 开发复盘
├── .env.example                 # 环境变量模板
├── .gitignore                   # Git 忽略文件
└── start.sh                     # 一键启动脚本（可选）
```

---

## 4. 数据模型（Schema）

### 4.1 请求

```json
{
  "topic": "string"   // 非空字符串，长度 2–120，去除首尾空格
}
```

示例（Example）

```json
POST /api/generate
{
  "topic": "Japan Travel"
}
```

约束：

- 去除空格后的长度：2–120 个字符

### 4.2 成功响应（200）

#### 数据结构

```json
{
  "topic": "string",
  "scripts": [
    {
      "title": "string",
      "hook": "string",
      "narrative": ["string"],
      "cta": "string"
    },
    {
      "title": "string",
      "hook": "string",
      "narrative": ["string"],
      "cta": "string"
    },
    {
      "title": "string",
      "hook": "string",
      "narrative": ["string"],
      "cta": "string"
    }
  ],
  "trends": {
    "hashtags": ["string"],
    "music_styles": ["string"]
  }
}
```

规则：

- scripts：**恰好 3 个元素**
- 每个 script 包含：

  - title：风格名称
  - hook：黄金 3 秒开场
  - narrative：3–6 个要点
  - cta：行动号召
- hashtags：

  - 数量：5–10 个
  - 每个以 `#` 开头
  - 不包含空格
- music_styles：

  - 数量：2–4 个
  - 每个为简短背景音乐风格描述短语

#### 示例（Example）

```json
{
  "topic": "Japan Travel",
  "scripts": [
    {
      "title": "City Walk Vlog",
      "hook": "3 seconds of Shibuya crossing",
      "narrative": ["Arrive in Tokyo", "Explore street food", "Night skyline"],
      "cta": "Follow for more travel tips"
    },
    {
      "title": "Food Discovery",
      "hook": "Close-up of sizzling street food",
      "narrative": ["Visit local market", "Try ramen", "Taste matcha desserts"],
      "cta": "Save this for your next trip"
    },
    {
      "title": "Cultural Experience",
      "hook": "Traditional shrine gate opening shot",
      "narrative": ["Walk through torii gates", "Join a tea ceremony", "Wear kimono"],
      "cta": "Like and follow for cultural travel content"
    }
  ],
  "trends": {
    "hashtags": ["#JapanTravel", "#TokyoVlog", "#TravelTips", "#StreetFood", "#CultureTrip"],
    "music_styles": ["Upbeat city-pop", "Soft lo-fi travel vibe"]
  }
}
```

---

### 4.3 错误响应（Error Schema）

```json
{
  "error": {
    "code": "BAD_REQUEST | LLM_TIMEOUT | LLM_BAD_OUTPUT | INTERNAL_ERROR",
    "message": "string"
  }
}
```

说明：

- BAD_REQUEST：输入校验失败（如 topic 为空或过短）
- LLM_TIMEOUT：调用百炼模型超时
- LLM_BAD_OUTPUT：模型返回结果无法通过 JSON/Schema 校验，且修复重试失败
- INTERNAL_ERROR：系统内部异常

---

## 5. API 接口

### 端点

`POST /api/generate`

请求头：

- Content-Type: application/json

错误响应：

- 所有非 200 响应必须符合 4.3 Error Schema
- 状态码与错误码映射：
  - 400 → BAD_REQUEST
  - 502 → LLM_BAD_OUTPUT
  - 504 → LLM_TIMEOUT
  - 500 → INTERNAL_ERROR

### 状态码

- 200：成功
- 400：无效输入
- 502：修复后 LLM 输出仍无效
- 504：LLM 超时
- 500：内部错误

### LLM 调用策略

- 超时：20 秒
- 重试：

  - 仅在 JSON 解析或模式验证失败时重试一次
  - 使用修复提示强制执行模式
  - 如果仍然无效 → 返回 502 `LLM_BAD_OUTPUT`

---

## 6. UI 规格说明

### 6.1 组件层级

```text
AppPage (page.tsx - Server Component)
├── ResultsPane (Client Component)
│   ├── EmptyState (Idle 状态)
│   ├── StatusCard (Loading / Error 状态)
│   ├── ScriptCardList (Success 状态)
│   │   └── ScriptCard ×3
│   │       └── CopyButton
│   ├── TrendCard (Success 状态)
│   │   ├── HashtagList
│   │   └── MusicStyleList
│   └── CopyAllButton (Success 状态)
└── ComposerBar (Client Component - Sticky Bottom)
    ├── TopicInput
    └── GenerateButton
```

### 6.2 布局结构（Layout）

页面采用布局：**结果区域在上方，输入区域固定在底部**。

#### 结构要求

- 页面分为上下两块：
  1. **ResultsPane**（上方，可滚动）：用于展示生成的卡片结果
  2. **ComposerBar**（底部固定/吸附）：包含输入框与生成按钮
- ComposerBar 必须始终可见（使用 Tailwind 的 `sticky` 或 `fixed` 定位），不随页面滚动消失
- ResultsPane 内容过多时仅滚动 ResultsPane（不要把输入栏滚走）
- 使用 Tailwind CSS 实现响应式布局（移动端优先）

#### 布局行为

- **初始（Idle）**：ResultsPane 显示空态占位（例如提示"输入主题开始生成"）
- **Loading**：ResultsPane 顶部显示 Loading 卡片或骨架屏；ComposerBar 输入禁用
- **Success**：ResultsPane 从上到下依次展示：
  - ScriptCard ×3
  - TrendCard ×1
  - CopyAllButton
- **Error**：ResultsPane 顶部显示错误提示卡片（包含 Retry 按钮），ComposerBar 允许编辑并重新生成

#### 滚动与定位

- 每次生成成功后，页面应自动滚动到 ResultsPane 顶部（确保用户立即看到新结果）
- 新结果替换旧结果（不保留历史）

### 6.3 UI 状态管理

| 状态    | ResultsPane 显示          | ComposerBar 状态      |
| ------- | ------------------------- | --------------------- |
| Idle    | EmptyState 空态提示       | 输入框可用，按钮可用  |
| Loading | StatusCard (Loading)      | 输入框禁用，按钮禁用  |
| Success | ScriptCard ×3 + TrendCard | 输入框可用，按钮可用  |
| Error   | StatusCard (Error)        | 输入框可用，按钮可用  |

#### 状态管理约束

- 使用 React 19 的 `useState` 管理 UI 状态
- TopicInput 与 GenerateButton 必须位于页面底部的 ComposerBar 中
- ComposerBar 在所有状态下保持可见（Loading 时禁用交互）
- 使用 `'use client'` 指令标记需要状态管理的组件

### 6.4 组件实现指南

#### 6.4.1 Server Components vs Client Components

- **Server Components**（默认）：
  - `app/page.tsx`：主页面，负责初始渲染
  - `app/layout.tsx`：根布局，配置全局样式和元数据

- **Client Components**（需要 `'use client'`）：
  - `ComposerBar`：需要表单状态和事件处理
  - `ResultsPane`：需要管理生成状态（idle/loading/success/error）
  - `CopyButton`：需要点击事件和剪贴板 API
  - 所有需要交互的子组件

#### 6.4.2 Tailwind CSS 使用规范

- 使用 Tailwind 实用类进行样式设计
- 响应式断点：`sm:` `md:` `lg:` `xl:` `2xl:`
- 自定义颜色和主题在 `tailwind.config.ts` 中配置
- 避免内联样式和 CSS Modules

#### 6.4.3 TypeScript 类型安全

- 所有组件必须定义 Props 接口
- 使用 `types/api.ts` 中定义的类型
- 启用严格模式（`strict: true`）
- 避免使用 `any` 类型

### 6.5 样式设计规范

#### 6.5.1 设计原则

- **现代化**：使用圆角、阴影、渐变等现代设计元素
- **清晰**：卡片之间留有足够间距，层次分明
- **响应式**：移动端优先，适配各种屏幕尺寸
- **可访问性**：符合 WCAG 2.1 AA 标准（对比度、焦点状态等）

#### 6.5.2 颜色方案（建议）

- **主色调**：紫色/蓝色渐变（TikTok 风格）
- **背景**：浅灰色（`bg-gray-50`）或白色
- **卡片**：白色背景 + 阴影（`bg-white shadow-lg`）
- **文本**：深灰色（`text-gray-900`）
- **强调**：品牌色（按钮、标签等）

---

## 7. LLM 提示词契约

### 系统提示词

"你是一位 TikTok 短视频内容策略师。仅返回有效的 JSON。不要使用 Markdown，不要添加解释。

- 输出必须为纯 JSON（不得包含 ```json 代码块、不得包含任何解释文字）
- 输出不得包含 Schema 未定义的额外字段（no extra keys）"

### 用户提示词模板

输入：`{topic}`
输出必须遵循响应模式：

- 3 个不同风格的脚本（Hook、Narrative、CTA）
- 5–10 个标签
- 2–4 个音乐风格
  语言必须匹配输入（中文 → 中文，英文 → 英文）

### 修复提示词

"你之前的输出不符合所需的 JSON 模式。仅返回严格符合模式的修正后 JSON。不要添加任何额外文本。"

---

## 8. 安全与配置

- API 密钥存储在 `.env` 文件中
- .env 文件必须加入 .gitignore，禁止提交到代码仓库
- 提供 `.env.example` 示例文件
- 后端通过环境变量读取密钥
- 前端永不暴露密钥

---

## 9. 验收标准

### 9.1 功能验收

1. ✅ 有效主题返回 3 个脚本卡片 + 1 个趋势卡片
2. ✅ 无效主题（为空 / 过短）返回 400 错误
3. ✅ 无效的 LLM JSON 触发一次修复重试
4. ✅ 复制按钮正确复制格式化的脚本内容
5. ✅ 加载和错误状态清晰可见
6. ✅ 系统可在本地端到端运行（前端 + 后端）

### 9.2 前端验收（Next.js 16）

1. ✅ 使用 Next.js 16 App Router（`app/` 目录）
2. ✅ 正确区分 Server Components 和 Client Components
3. ✅ 使用 React 19 特性（如需要）
4. ✅ Tailwind CSS 样式正确应用
5. ✅ TypeScript 无类型错误（`npm run type-check` 通过）
6. ✅ 响应式布局在移动端和桌面端均正常
7. ✅ ComposerBar 固定在底部，不随滚动消失
8. ✅ 生成成功后自动滚动到结果顶部

### 9.3 后端验收

### 11.1 开发流程

1. 有效主题返回 3 个脚本卡片 + 趋势卡片
2. 无效主题（为空 / 过短）返回 400
3. 无效的 LLM JSON 触发一次修复重试
4. 复制按钮复制格式化的脚本
5. 加载和错误状态可见
6. 系统可在本地端到端运行
7. **实现后端**：FastAPI + LLM 集成
8. **实现前端**：App Router + Client Components
9. **集成测试**：端到端测试

## 10. 开发范式

### 11.2 技术决策原则

- **使用最新稳定版本**：Next.js 16 + React 19
- **优先使用 Server Components**：减少客户端 JavaScript
- **类型安全**：TypeScript 严格模式
- **样式一致性**：Tailwind CSS 实用类
- **性能优化**：代码分割、懒加载、图片优化
- **安全第一**：密钥管理、输入验证、CORS 配置

---
