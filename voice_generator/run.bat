@echo off
echo ====================================
echo   Gerador de Vozes com Edge TTS
echo ====================================
echo.

REM Verifica se o Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo Erro: Python nao encontrado. Por favor, instale o Python 3.8 ou superior.
    pause
    exit /b 1
)

echo [OK] Python encontrado
echo.

REM Verifica se o ambiente virtual existe
if not exist "venv" (
    echo [*] Criando ambiente virtual...
    python -m venv venv
    echo [OK] Ambiente virtual criado
)

REM Ativa o ambiente virtual
echo [*] Ativando ambiente virtual...
call venv\Scripts\activate

REM Instala dependencias
echo [*] Instalando/atualizando dependencias...
python -m pip install --upgrade pip -q
pip install -r requirements.txt -q

echo [OK] Dependencias instaladas
echo.
echo [*] Iniciando servidor Flask...
echo [*] Acesse: http://localhost:5000
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

REM Inicia a aplicacao
python app.py

pause
