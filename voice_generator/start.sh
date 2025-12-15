#!/bin/bash

echo "🎙️  Gerador de Vozes - Edge TTS"
echo "================================"
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.8 ou superior."
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"
echo ""

# Verificar se as dependências estão instaladas
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📦 Instalando dependências..."
    pip install -r requirements.txt
    echo ""
fi

# Criar diretório de outputs
mkdir -p outputs

# Iniciar aplicação
echo "🚀 Iniciando servidor..."
echo ""
python3 app.py
