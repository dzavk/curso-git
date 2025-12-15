#!/bin/bash

echo "🎙️  Gerador de Vozes com Edge TTS"
echo "================================="
echo ""

# Verifica se o Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale o Python 3.8 ou superior."
    exit 1
fi

echo "✅ Python 3 encontrado"

# Verifica se o ambiente virtual existe
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
    echo "✅ Ambiente virtual criado"
fi

# Ativa o ambiente virtual
echo "🔄 Ativando ambiente virtual..."
source venv/bin/activate

# Instala dependências
echo "📥 Instalando/atualizando dependências..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

echo "✅ Dependências instaladas"
echo ""
echo "🚀 Iniciando servidor Flask..."
echo "📍 Acesse: http://localhost:5000"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

# Inicia a aplicação
python app.py
