@echo off
echo 🎙️  Gerador de Vozes - Edge TTS
echo ================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado. Por favor, instale Python 3.8 ou superior.
    pause
    exit /b 1
)

echo ✅ Python encontrado
python --version
echo.

REM Instalar dependências
echo 📦 Verificando dependências...
pip install -r requirements.txt
echo.

REM Criar diretório de outputs
if not exist "outputs" mkdir outputs

REM Iniciar aplicação
echo 🚀 Iniciando servidor...
echo.
python app.py

pause
