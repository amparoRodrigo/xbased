#!/bin/bash

echo "🚀 Iniciando Test CA Login Application"
echo "======================================"

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Por favor, instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências se não existirem
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo "🌐 Iniciando aplicação de login..."
echo "📍 Acesse: http://localhost:3000"
echo "🔗 Test CA estará em: http://localhost:8888/testca"
echo ""
echo "Para parar a aplicação, pressione Ctrl+C"
echo ""

# Iniciar a aplicação
npm start
