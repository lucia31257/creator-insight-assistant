"""
LLM 客户端
负责与阿里云百炼 API 交互
"""

import httpx
import json
import os
from typing import List, Dict
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()


class LLMClient:
    """阿里云百炼 LLM 客户端"""

    def __init__(self):
        self.api_key = os.getenv("ALIBABA_API_KEY")
        self.api_endpoint = os.getenv(
            "ALIBABA_API_ENDPOINT",
            "https://dashscope.aliyuncs.com/compatible-mode/v1"
        )
        self.model = "qwen-max"
        self.timeout = 20.0

        if not self.api_key:
            raise ValueError("未配置 ALIBABA_API_KEY 环境变量")

    def get_system_prompt(self) -> str:
        """获取系统提示词"""
        return """You are a TikTok short video content strategist. Return only valid JSON. Do not use Markdown, do not add explanations.

- Output must be pure JSON (no ```json code blocks, no explanatory text)
- Output must not contain extra fields not defined in the schema (no extra keys)
- Match the language of the input topic: if the topic is in Chinese, respond in Chinese; if in English, respond in English"""

    def get_user_prompt(self, topic: str) -> str:
        """获取用户提示词"""
        # 检测输入语言
        is_chinese = any('\u4e00' <= char <= '\u9fff' for char in topic)

        if is_chinese:
            # 中文提示词
            return f"""输入主题: {topic}

请用中文生成符合以下 JSON 模式的内容：

{{
  "topic": "{topic}",
  "scripts": [
    {{
      "title": "风格名称",
      "hook": "黄金3秒开场",
      "narrative": ["要点1", "要点2", "要点3"],
      "cta": "行动号召"
    }},
    {{
      "title": "风格名称",
      "hook": "黄金3秒开场",
      "narrative": ["要点1", "要点2", "要点3"],
      "cta": "行动号召"
    }},
    {{
      "title": "风格名称",
      "hook": "黄金3秒开场",
      "narrative": ["要点1", "要点2", "要点3"],
      "cta": "行动号召"
    }}
  ],
  "trends": {{
    "hashtags": ["#标签1", "#标签2", "#标签3", "#标签4", "#标签5"],
    "music_styles": ["音乐风格1", "音乐风格2"]
  }}
}}

要求：
- 必须生成恰好 3 个不同风格的脚本
- 每个脚本的 narrative 包含 3-6 个要点
- 标签数量：5-10 个，每个以 # 开头，不包含空格
- 音乐风格数量：2-4 个
- **重要：所有内容必须使用中文**
- 仅返回 JSON，不要包含任何其他文本"""
        else:
            # 英文提示词
            return f"""Input topic: {topic}

Please generate content in English that matches the following JSON schema:

{{
  "topic": "{topic}",
  "scripts": [
    {{
      "title": "Style Name",
      "hook": "Golden 3-second opening",
      "narrative": ["Point 1", "Point 2", "Point 3"],
      "cta": "Call to action"
    }},
    {{
      "title": "Style Name",
      "hook": "Golden 3-second opening",
      "narrative": ["Point 1", "Point 2", "Point 3"],
      "cta": "Call to action"
    }},
    {{
      "title": "Style Name",
      "hook": "Golden 3-second opening",
      "narrative": ["Point 1", "Point 2", "Point 3"],
      "cta": "Call to action"
    }}
  ],
  "trends": {{
    "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"],
    "music_styles": ["Music style 1", "Music style 2"]
  }}
}}

Requirements:
- Must generate exactly 3 scripts with different styles
- Each script's narrative should contain 3-6 points
- Hashtags: 5-10 items, each starting with #, no spaces
- Music styles: 2-4 items
- **Important: All content must be in English**
- Return only JSON, no additional text"""

    def get_repair_prompt(self, original_output: str, topic: str) -> str:
        """获取修复提示词"""
        is_chinese = any('\u4e00' <= char <= '\u9fff' for char in topic)

        if is_chinese:
            return f"""你之前的输出不符合所需的 JSON 模式。

之前的输出：
{original_output}

请返回严格符合模式的修正后 JSON。不要添加任何额外文本。仅返回纯 JSON。所有内容必须使用中文。"""
        else:
            return f"""Your previous output does not match the required JSON schema.

Previous output:
{original_output}

Please return corrected JSON that strictly follows the schema. Do not add any extra text. Return only pure JSON. All content must be in English."""

    async def call_api(self, messages: List[Dict[str, str]]) -> str:
        """
        调用 LLM API

        Args:
            messages: 消息列表

        Returns:
            LLM 返回的内容

        Raises:
            httpx.TimeoutException: 超时
            Exception: 其他错误
        """
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 2000,
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.api_endpoint}/chat/completions",
                headers=headers,
                json=payload,
            )

            if response.status_code != 200:
                raise Exception(
                    f"LLM API 返回错误: {response.status_code} - {response.text}")

            result = response.json()
            content = result["choices"][0]["message"]["content"]
            return content

    def clean_json_output(self, content: str) -> str:
        """
        清理 JSON 输出，移除可能的 Markdown 代码块

        Args:
            content: 原始输出

        Returns:
            清理后的 JSON 字符串
        """
        content = content.strip()

        # 移除 Markdown 代码块标记
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]

        if content.endswith("```"):
            content = content[:-3]

        return content.strip()

    def parse_json(self, content: str) -> dict:
        """
        解析 JSON 字符串

        Args:
            content: JSON 字符串

        Returns:
            解析后的字典

        Raises:
            ValueError: JSON 解析失败
        """
        cleaned = self.clean_json_output(content)

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            raise ValueError(f"JSON 解析失败: {str(e)}")

    async def generate(self, topic: str) -> dict:
        """
        生成脚本和趋势推荐

        Args:
            topic: 主题

        Returns:
            生成的结果字典

        Raises:
            httpx.TimeoutException: 超时
            ValueError: JSON 解析或验证失败
            Exception: 其他错误
        """
        # 第一次调用
        messages = [
            {"role": "system", "content": self.get_system_prompt()},
            {"role": "user", "content": self.get_user_prompt(topic)},
        ]

        try:
            content = await self.call_api(messages)
            return self.parse_json(content)
        except ValueError as e:
            # 第一次失败，尝试修复
            print(f"第一次解析失败: {e}")
            print(f"原始输出: {content}")

            # 使用修复提示词重试
            repair_messages = [
                {"role": "system", "content": self.get_system_prompt()},
                {"role": "user", "content": self.get_user_prompt(topic)},
                {"role": "assistant", "content": content},
                {"role": "user", "content": self.get_repair_prompt(
                    content, topic)},
            ]

            content_retry = await self.call_api(repair_messages)

            try:
                return self.parse_json(content_retry)
            except ValueError as e2:
                # 修复后仍然失败
                print(f"修复后仍然失败: {e2}")
                print(f"修复后输出: {content_retry}")
                raise ValueError("LLM 输出格式不正确，修复重试后仍然无效")
