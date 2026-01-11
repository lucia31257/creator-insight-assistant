@echo off
REM TikTok Creator Insight Assistant - Windows 环境配置脚本

echo ========================================
echo 🚀 TikTok Creator Insight Assistant - 环境配置
echo ========================================
echo.

REM 检查 Node.js
echo 📦 检查 Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未安装 Node.js，请先安装 Node.js 18+
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%

REM 检查 Python
echo 📦 检查 Python...
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 未安装 Python，请先安装 Python 3.9+
    echo    下载地址: https://www.python.org/downloads/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ Python 版本: %PYTHON_VERSION%

echo.
echo ========================================
echo 🔧 配置后端环境变量
echo ========================================

REM 配置后端环境变量
if not exist "backend\.env" (
    echo 📝 创建 backend\.env 文件...
    set /p api_key="请输入阿里云百炼 API Key: "
    
    (
        echo ALIBABA_API_KEY=!api_key!
        echo ALIBABA_API_ENDPOINT=https://dashscope.aliyuncs.com/compatible-mode/v1
    ) > backend\.env
    echo ✅ 后端环境变量配置完成
) else (
    echo ✅ backend\.env 已存在，跳过配置
)

echo.
echo ========================================
echo 🔧 配置前端环境变量
echo ========================================

REM 配置前端环境变量
if not exist "frontend\.env.local" (
    echo 📝 创建 frontend\.env.local 文件...
    echo NEXT_PUBLIC_BACKEND_URL=http://localhost:8000 > frontend\.env.local
    echo ✅ 前端环境变量配置完成
) else (
    echo ✅ frontend\.env.local 已存在，跳过配置
)

echo.
echo ========================================
echo 📦 安装后端依赖
echo ========================================

cd backend

REM 检查是否安装了 uv
where uv >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✨ 检测到 uv，使用 uv 进行环境管理
    
    REM 使用 uv 创建虚拟环境
    if not exist "venv" (
        echo 📦 使用 uv 创建 Python 虚拟环境...
        uv venv
        echo ✅ 虚拟环境创建完成
    ) else (
        echo ✅ 虚拟环境已存在
    )
    
    REM 使用 uv 安装依赖
    echo 📦 使用 uv 安装 Python 依赖...
    call venv\Scripts\activate.bat
    uv pip install -r requirements.txt
    echo ✅ 后端依赖安装完成（使用 uv）
) else (
    echo 💡 未检测到 uv，使用标准 pip
    echo    推荐安装 uv 以获得更快的速度: https://github.com/astral-sh/uv
    
    REM 创建虚拟环境
    if not exist "venv" (
        echo 📦 创建 Python 虚拟环境...
        python -m venv venv
        echo ✅ 虚拟环境创建完成
    ) else (
        echo ✅ 虚拟环境已存在
    )
    
    REM 激活虚拟环境并安装依赖
    echo 📦 安装 Python 依赖...
    call venv\Scripts\activate.bat
    python -m pip install --upgrade pip
    pip install -r requirements.txt
    echo ✅ 后端依赖安装完成
)

cd ..

echo.
echo ========================================
echo 📦 安装前端依赖
echo ========================================

cd frontend
echo 📦 安装 Node.js 依赖...
call npm install
echo ✅ 前端依赖安装完成

cd ..

echo.
echo ========================================
echo ✅ 环境配置完成！
echo ========================================
echo.
echo 💡 提示：
where uv >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo   - 安装 uv 可以获得更快的 Python 包管理速度
    echo     https://github.com/astral-sh/uv
    echo.
)
echo 下一步：
echo   1. 运行 start.bat 启动服务
echo   2. 或者查看 README.md 了解详细启动步骤
echo.
pause
