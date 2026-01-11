"""
TikTok Creator Insight Assistant - 后端服务
FastAPI 应用，调用阿里云百炼 LLM
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

from models import (
    GenerateRequest,
    GenerateResponse,
    ErrorResponse,
    ErrorDetail,
)
from llm_client import LLMClient

app = FastAPI(title="TikTok Creator Insight Assistant API")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化 LLM 客户端
try:
    llm_client = LLMClient()
except ValueError as e:
    print(f"警告: LLM 客户端初始化失败 - {e}")
    llm_client = None


@app.get("/")
async def root():
    """健康检查"""
    return {"status": "ok", "service": "TikTok Creator Insight Assistant"}


@app.post("/api/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    """生成脚本和趋势推荐"""

    if llm_client is None:
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": "LLM 客户端未正确初始化，请检查环境变量配置"
                }
            }
        )

    topic = request.topic.strip()

    try:
        # 调用 LLM 生成内容
        result = await llm_client.generate(topic)

        # 使用 Pydantic 验证响应
        validated_response = GenerateResponse(**result)
        return validated_response

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail={
                "error": {
                    "code": "LLM_TIMEOUT",
                    "message": "LLM 请求超时"
                }
            }
        )
    except ValueError as e:
        # JSON 解析或验证失败
        raise HTTPException(
            status_code=502,
            detail={
                "error": {
                    "code": "LLM_BAD_OUTPUT",
                    "message": str(e)
                }
            }
        )
    except Exception as e:
        # 其他错误
        raise HTTPException(
            status_code=500,
            detail={
                "error": {
                    "code": "INTERNAL_ERROR",
                    "message": f"生成过程中发生错误: {str(e)}"
                }
            }
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
