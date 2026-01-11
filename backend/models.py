"""
数据模型定义
使用 Pydantic 进行数据验证
"""

from pydantic import BaseModel, Field, validator
from typing import List


class GenerateRequest(BaseModel):
    """生成请求模型"""
    topic: str = Field(..., min_length=2, max_length=120)

    @validator("topic")
    def validate_topic(cls, v):
        v = v.strip()
        if len(v) < 2 or len(v) > 120:
            raise ValueError("主题长度必须在 2-120 个字符之间")
        return v


class Script(BaseModel):
    """脚本模型"""
    title: str
    hook: str
    narrative: List[str] = Field(..., min_items=3, max_items=6)
    cta: str


class Trends(BaseModel):
    """趋势模型"""
    hashtags: List[str] = Field(..., min_items=5, max_items=10)
    music_styles: List[str] = Field(..., min_items=2, max_items=4)


class GenerateResponse(BaseModel):
    """生成响应模型"""
    topic: str
    scripts: List[Script] = Field(..., min_items=3, max_items=3)
    trends: Trends


class ErrorDetail(BaseModel):
    """错误详情"""
    code: str
    message: str


class ErrorResponse(BaseModel):
    """错误响应模型"""
    error: ErrorDetail
