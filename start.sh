#!/bin/bash

# TikTok Creator Insight Assistant - 启动脚本

echo "🚀 TikTok Creator Insight Assistant"
echo "======================================"
echo ""

# 检查环境变量是否配置
if [ ! -f "backend/.env" ]; then
    echo "❌ 未找到 backend/.env 文件"
    echo "请先运行: ./setup.sh"
    exit 1
fi

if [ ! -f "frontend/.env.local" ]; then
    echo "❌ 未找到 frontend/.env.local 文件"
    echo "请先运行: ./setup.sh"
    exit 1
fi

# 检查依赖是否安装
if [ ! -d "backend/venv" ]; then
    echo "❌ 未找到 Python 虚拟环境"
    echo "请先运行: ./setup.sh"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "❌ 未找到 Node.js 依赖"
    echo "请先运行: ./setup.sh"
    exit 1
fi

echo "✅ 环境检查通过"
echo ""

# 启动后端
echo "🔧 启动后端服务..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

echo "✅ 后端服务已启动 (PID: $BACKEND_PID)"
echo "   地址: http://localhost:8000"
echo ""

# 等待后端启动
echo "⏳ 等待后端服务就绪..."
sleep 3

# 启动前端
echo "🔧 启动前端服务..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ 前端服务已启动 (PID: $FRONTEND_PID)"
echo "   地址: http://localhost:3000"
echo ""

echo "======================================"
echo "✅ 所有服务已启动！"
echo "======================================"
echo ""
echo "📱 访问应用: http://localhost:3000"
echo "📚 API 文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 保存 PID 到文件
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# 等待用户中断
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f .backend.pid .frontend.pid; echo '✅ 服务已停止'; exit 0" INT TERM

# 保持脚本运行
wait
