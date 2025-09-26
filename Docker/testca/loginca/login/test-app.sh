#!/bin/bash

echo "🧪 Testando Test CA Login Application"
echo "====================================="

# Função para cleanup
cleanup() {
    echo ""
    echo "🛑 Parando serviços de teste..."
    kill $BACKEND_PID 2>/dev/null
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

# Iniciar backend
echo "🔧 Iniciando backend..."
cd /home/ubuntu/testca-login-app/backend
npm start &
BACKEND_PID=$!

# Aguardar backend inicializar
echo "⏳ Aguardando backend inicializar..."
sleep 5

# Testar backend
echo "🔍 Testando backend..."
RESPONSE=$(curl -s http://localhost:5000/api/setup-status)
echo "Status da configuração: $RESPONSE"

echo ""
echo "✅ Backend está rodando!"
echo "📍 Backend: http://localhost:5000"
echo "📍 Test CA: http://localhost:8888/testca"
echo ""
echo "🎯 Próximos passos para teste completo:"
echo "1. Em outro terminal, execute: cd /home/ubuntu/testca-login-app && npm start"
echo "2. Acesse: http://localhost:3000"
echo "3. Configure o administrador inicial"
echo ""
echo "Pressione Ctrl+C para parar o backend"

# Aguardar
wait $BACKEND_PID
