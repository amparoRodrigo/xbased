#!/bin/bash

echo "🚀 Iniciando Test CA Login Application com Backend"
echo "=================================================="

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

# Verificar arquivo .env
if [ ! -f ".env" ]; then
    echo "⚠️  Arquivo .env não encontrado. Criando arquivo de exemplo..."
    cp .env.example .env 2>/dev/null || echo "Arquivo .env.example não encontrado"
    echo "📝 Configure o arquivo .env com suas credenciais de email"
fi

# Instalar dependências do frontend
echo "📦 Instalando dependências do frontend..."
if [ ! -d "node_modules" ]; then
    npm install
fi

# Instalar dependências do backend
echo "📦 Instalando dependências do backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..

echo ""
echo "🌐 Iniciando serviços..."
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend: http://localhost:5000"
echo "🔗 Test CA: http://localhost:8888/testca (após login)"
echo ""
echo "Para parar os serviços, pressione Ctrl+C"
echo ""

# Função para cleanup
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

# Iniciar backend em background
echo "🔧 Iniciando backend..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Aguardar um pouco para o backend iniciar
sleep 3

# Iniciar frontend
echo "🎨 Iniciando frontend..."
npm start &
FRONTEND_PID=$!

# Aguardar os processos
wait $BACKEND_PID $FRONTEND_PID
