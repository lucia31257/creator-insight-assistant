#!/bin/bash

# TikTok Creator Insight Assistant - 环境配置脚本

set -e

echo "🚀 TikTok Creator Insight Assistant - 环境配置"
echo "======================================"
echo ""

# 检查 Node.js
echo "📦 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ 未安装 Node.js，请先安装 Node.js 18+"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js 版本: $NODE_VERSION"

# 检查 Python
echo "📦 检查 Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ 未安装 Python，请先安装 Python 3.9+"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo "✅ Python 版本: $PYTHON_VERSION"

echo ""
echo "======================================"
echo "🔧 配置后端环境变量"
echo "======================================"

# 配置后端环境变量
if [ ! -f "backend/.env" ]; then
    echo "📝 创建 backend/.env 文件..."
    read -p "请输入阿里云百炼 API Key: " api_key
    
    cat > backend/.env << EOF
ALIBABA_API_KEY=$api_key
ALIBABA_API_ENDPOINT=https://dashscope.aliyuncs.com/compatible-mode/v1
EOF
    echo "✅ 后端环境变量配置完成"
else
    echo "✅ backend/.env 已存在，跳过配置"
fi

echo ""
echo "======================================"
echo "🔧 配置前端环境变量"
echo "======================================"

# 配置前端环境变量
if [ ! -f "frontend/.env.local" ]; then
    echo "📝 创建 frontend/.env.local 文件..."
    cat > frontend/.env.local << EOF
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
EOF
    echo "✅ 前端环境变量配置完成"
else
    echo "✅ frontend/.env.local 已存在，跳过配置"
fi

echo ""
echo "======================================"
echo "📦 安装后端依赖"
echo "======================================"

cd backend

# 检查是否安装了 uv
if command -v uv &> /dev/null; then
    echo "✨ 检测到 uv，使用 uv 进行环境管理"
    
    # 使用 uv 创建虚拟环境
    if [ ! -d "venv" ]; then
        echo "📦 使用 uv 创建 Python 虚拟环境..."
        uv venv
        echo "✅ 虚拟环境创建完成"
    else
        echo "✅ 虚拟环境已存在"
    fi
    
    # 使用 uv 安装依赖
    echo "📦 使用 uv 安装 Python 依赖..."
    source venv/bin/activate
    uv pip install -r requirements.txt
    echo "✅ 后端依赖安装完成（使用 uv）"
else
    echo "💡 未检测到 uv，使用标准 pip（推荐安装 uv 以获得更快的速度）"
    
    # 创建虚拟环境
    if [ ! -d "venv" ]; then
        echo "📦 创建 Python 虚拟环境..."
        python3 -m venv venv
        echo "✅ 虚拟环境创建完成"
    else
        echo "✅ 虚拟环境已存在"
    fi
    
    # 激活虚拟环境并安装依赖
    echo "📦 安装 Python 依赖..."
    source venv/bin/activate
    pip install --upgrade pip
    pip install -r requirements.txt
    echo "✅ 后端依赖安装完成"
fi

cd ..

echo ""
echo "======================================"
echo "📦 安装前端依赖"
echo "======================================"

cd frontend
echo "📦 安装 Node.js 依赖..."
npm install
echo "✅ 前端依赖安装完成"

cd ..

echo ""
echo "======================================"
echo "✅ 环境配置完成！"
echo "======================================"
echo ""
echo "💡 提示："
if ! command -v uv &> /dev/null; then
    echo "  - 安装 uv 可以获得更快的 Python 包管理速度："
    echo "    curl -LsSf https://astral.sh/uv/install.sh | sh"
    echo ""
fi
echo "下一步："
echo "  1. 运行 ./start.sh 启动服务"
echo "  2. 或者查看 README.md 了解详细启动步骤"
echo ""
