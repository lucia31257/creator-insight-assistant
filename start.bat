@echo off
REM TikTok Creator Insight Assistant - Windows 启动脚本

echo ========================================
echo 🚀 TikTok Creator Insight Assistant
echo ========================================
echo.

REM 检查环境变量是否配置
if not exist "backend\.env" (
    echo ❌ 未找到 backend\.env 文件
    echo 请先运行: setup.bat
    pause
    exit /b 1
)

if not exist "frontend\.env.local" (
    echo ❌ 未找到 frontend\.env.local 文件
    echo 请先运行: setup.bat
    pause
    exit /b 1
)

REM 检查依赖是否安装
if not exist "backend\venv" (
    echo ❌ 未找到 Python 虚拟环境
    echo 请先运行: setup.bat
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo ❌ 未找到 Node.js 依赖
    echo 请先运行: setup.bat
    pause
    exit /b 1
)

echo ✅ 环境检查通过
echo.

REM 启动后端
echo 🔧 启动后端服务...
cd backend
start "Backend Server" cmd /k "call venv\Scripts\activate.bat && python main.py"
cd ..

echo ✅ 后端服务已启动
echo    地址: http://localhost:8000
echo.

REM 等待后端启动
echo ⏳ 等待后端服务就绪...
timeout /t 3 /nobreak >nul

REM 启动前端
echo 🔧 启动前端服务...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

echo ✅ 前端服务已启动
echo    地址: http://localhost:3000
echo.

echo ========================================
echo ✅ 所有服务已启动！
echo ========================================
echo.
echo 📱 访问应用: http://localhost:3000
echo 📚 API 文档: http://localhost:8000/docs
echo.
echo 💡 提示：
echo   - 后端和前端在独立的窗口中运行
echo   - 关闭对应窗口即可停止服务
echo   - 或按 Ctrl+C 停止单个服务
echo.
pause
