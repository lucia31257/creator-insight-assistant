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

### 1. Spec 驱动的开发方法

本项目采用**规范驱动开发（Spec-Driven Development）**，将 `spec.md` 作为单一事实来源（Single Source of Truth）。

#### 1.1 Spec 的结构设计

在编写 `spec.md` 时，我采用了以下策略来引导 AI 生成正确的代码：

**a) 分层明确的架构定义**
```markdown
## 3. 系统架构
### 3.1 前端（Next.js 16/ React）
职责：...
禁止：...
前端技术约束：...
```

**关键点**：
- 明确职责边界，避免 AI 生成越界代码
- 使用"禁止"列表明确排除不需要的功能
- 技术约束（如必须使用 App Router）确保技术选型正确

**b) 数据契约优先（Schema-First）**
```markdown
## 4. 数据模型（Schema）
### 4.1 请求
### 4.2 成功响应（200）
### 4.3 错误响应
```

**关键点**：
- 先定义数据结构，再生成代码
- 包含完整的验证规则（如 `min_length`, `max_length`）
- 明确错误码和错误消息格式

**c) 详细的用户故事（User Story）**
```markdown
### US-1 输入
作为创作者，我可以输入一个模糊的主题或内容方向（中文或英文）。
```

**关键点**：
- 从用户视角描述功能，帮助 AI 理解业务逻辑
- 每个用户故事都是独立的、可测试的功能点

**d) UI 组件层级结构**
```markdown
### 6.1 组件层级
- AppPage
  - TopicForm
    - TopicInput
    - GenerateButton
  - StatusBanner
    ...
```

**关键点**：
- 明确的组件层级帮助 AI 理解 React 组件结构
- 避免生成扁平化的单一组件

#### 1.2 Prompt 工程策略

在 Cursor Composer Mode 中，我使用了以下 Prompt 策略：

**策略 1：一次性完整生成**
```
基于这个spec，直接生成完整项目的所有代码。
包括：
- 所有TypeScript文件
- 所有React组件
- API路由
- 类型定义
- Tailwind样式

一次性输出，不要分批。
```

**为什么有效**：
- 明确要求一次性生成，避免 AI 分步生成导致的不一致
- 列出所有需要的文件类型，确保完整性

**策略 2：引用 Spec 文件**
```
@spec.md 
基于这个spec，直接生成完整项目的所有代码。
```

**为什么有效**：
- `@spec.md` 让 AI 读取完整的规范文档
- 确保所有代码都基于同一份规范

**策略 3：明确技术约束**
在 Spec 中明确：
- "必须使用 Next.js 16（App Router）"
- "所有页面组件放置在 app/ 目录下"
- "前端永不暴露密钥"

这些约束直接体现在生成的代码中。

## 遇到的挑战和解决方案

### 关键修正（Crucial Fixes）

#### 修正案例 1：API 端点格式错误导致的 500 错误

**问题描述**：
初始生成的代码使用了错误的阿里云 DashScope API 格式，导致后端返回 500 错误。

**AI 初始生成的错误代码**：
```python
# 错误的 API 格式
self.api_endpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

payload = {
    "model": "qwen-turbo",
    "input": {
        "messages": [...]
    },
    "parameters": {...}
}
```

**问题根源分析**：
1. **Spec 中缺少 API 格式细节**：`spec.md` 只提到"调用阿里云百炼 LLM"，但没有明确 API 格式
2. **AI 基于通用知识推测**：AI 使用了 DashScope 原生 API 格式，但实际应该使用兼容 OpenAI 的格式
3. **错误处理不够详细**：初始代码的错误日志不足以诊断问题

**解决方案：通过修改代码和补充 Spec**

**步骤 1：诊断问题**
- 添加详细的错误日志，打印 API 响应结构
- 发现 API 返回格式不匹配

**步骤 2：查阅实际 API 文档**
- 确认阿里云百炼使用兼容 OpenAI 的 API 格式
- 正确的端点是：`https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`

**步骤 3：修正代码**
```python
# 修正后的 API 格式
self.api_endpoint = "https://dashscope.aliyuncs.com/compatible-mode/v1"
self.model = "qwen-max"

payload = {
    "model": self.model,
    "messages": messages,  # 直接使用 messages，不需要嵌套在 input 中
    "temperature": 0.7,
    "max_tokens": 2000,
}

response = await client.post(
    f"{self.api_endpoint}/chat/completions",  # 使用 /chat/completions 端点
    ...
)
```

**步骤 4：改进错误处理**
- 添加 JSON 清理逻辑，处理可能的 Markdown 代码块
- 实现自动重试机制，在 JSON 解析失败时使用修复提示词

**思考**：
这个问题暴露了 **Spec 的粒度问题**。我意识到：
- **外部 API 集成需要明确的格式说明**：不能假设 AI 知道所有第三方 API 的细节
- **错误处理应该分层**：网络错误、API 错误、解析错误应该分别处理
- **可观测性很重要**：详细的日志帮助快速定位问题

**后续改进**：
在 `process.md` 中补充了实际的 API 端点信息，作为未来开发的参考。

---

#### 修正案例 2：环境变量命名不一致

**问题描述**：
初始代码使用 `ALIYUN_BAILIAN_API_KEY`，但实际应该使用 `ALIBABA_API_KEY`。

**AI 初始生成的代码**：
```python
self.api_key = os.getenv('ALIYUN_BAILIAN_API_KEY')
```

**问题根源**：
- Spec 中提到"API 密钥存储在 `.env` 文件中"，但没有明确变量名
- AI 基于"阿里云百炼"这个名称生成了变量名

**解决方案**：
```python
# 修正后
self.api_key = os.getenv("ALIBABA_API_KEY")
```

**架构师思考**：
这个问题体现了 **命名规范的重要性**：
- 环境变量命名应该与实际服务提供商的命名保持一致
- 应该在 Spec 中明确列出所有环境变量名称
- 或者提供 `.env.example` 文件作为参考

**后续改进**：
- 在代码中统一使用 `ALIBABA_API_KEY`
- 在 README 中明确说明环境变量配置


