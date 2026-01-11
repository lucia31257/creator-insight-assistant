#!/bin/bash

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "安装依赖..."
pip install -r requirements.txt

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "警告: .env 文件不存在，请从 .env.example 创建并配置"
fi

# 启动服务器
echo "启动 FastAPI 服务器..."
uvicorn main:app --reload --host 0.0.0.0 --port 8000
