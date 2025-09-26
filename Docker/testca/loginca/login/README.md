# Test CA Login Application com Autenticação

Esta é uma aplicação React moderna com backend Node.js que fornece autenticação segura para acessar o Test CA do X-Road.

## 🚀 Características

- **Configuração Inicial**: Cadastro do administrador apenas na primeira inicialização
- **Autenticação Segura**: Sistema completo com JWT e hash de senhas
- **Envio por Email**: Credenciais enviadas automaticamente por email
- **Design Moderno**: Interface limpa e responsiva
- **Backend Robusto**: API REST com Express.js
- **Integração Completa**: Funciona junto com o Test CA

## 📧 Configuração de Email

### Gmail (Recomendado)

1. **Ative a verificação em duas etapas** na sua conta Google
2. **Gere uma senha de app**:
   - Vá em Configurações > Segurança > Verificação em duas etapas
   - Role até "Senhas de app"
   - Selecione "Email" e "Outro (nome personalizado)"
   - Digite "TestCA" e clique em "Gerar"
3. **Configure o arquivo .env**:
   ```bash
   EMAIL_USER=seu-email@gmail.com
   EMAIL_PASS=senha-de-app-gerada
   ```

### Outros Provedores

Consulte a [documentação do Nodemailer](https://nodemailer.com/smtp/) para configurações específicas.

## 🛠️ Como Usar

### Opção 1: Desenvolvimento Local

1. **Configure o email** (edite o arquivo `.env`):
   ```bash
   cp .env.example .env
   # Edite o .env com suas credenciais
   ```

2. **Inicie a aplicação completa**:
   ```bash
   ./start-full.sh
   ```

3. **Acesse**: http://localhost:3000

### Opção 2: Docker Compose

1. **Configure variáveis de ambiente**:
   ```bash
   export EMAIL_USER=seu-email@gmail.com
   export EMAIL_PASS=sua-senha-de-app
   ```

2. **Execute com Docker**:
   ```bash
   docker-compose up --build
   ```

## 📱 Fluxo de Uso

### Primeira Inicialização

1. **Acesse** http://localhost:3000
2. **Tela de Configuração** aparecerá automaticamente
3. **Preencha**:
   - Email do administrador
   - Senha (mínimo 6 caracteres)
   - Confirmação da senha
4. **Clique em "Configurar Administrador"**
5. **Credenciais são enviadas por email**
6. **Redirecionamento automático** para tela de login

### Logins Subsequentes

1. **Acesse** http://localhost:3000
2. **Tela de Login** aparecerá
3. **Use as credenciais** enviadas por email
4. **Redirecionamento automático** para Test CA

## 🏗️ Estrutura do Projeto

```
testca-login-app/
├── backend/                    # Backend Node.js
│   ├── server.js              # Servidor Express
│   ├── package.json           # Dependências do backend
│   ├── Dockerfile             # Container do backend
│   └── .env.example           # Exemplo de configuração
├── src/                       # Frontend React
│   ├── components/
│   │   ├── AdminSetup.js      # Configuração inicial
│   │   ├── LoginForm.js       # Formulário de login
│   │   └── LoadingSpinner.js  # Componente de loading
│   ├── services/
│   │   └── api.js             # Serviços de API
│   └── App.js                 # Componente principal
├── docker-compose.yml         # Orquestração completa
├── start-full.sh              # Script de inicialização
└── README.md                  # Esta documentação
```

## 🔧 Endpoints da API

- `GET /api/setup-status` - Verificar se admin foi configurado
- `POST /api/setup-admin` - Configurar administrador inicial
- `POST /api/login` - Fazer login
- `GET /api/verify-token` - Verificar token JWT

## 🔒 Segurança

- **Senhas hasheadas** com bcrypt
- **Tokens JWT** para autenticação
- **Configuração única** do administrador
- **Validação de entrada** em frontend e backend
- **CORS configurado** adequadamente

## 🌐 Portas Utilizadas

- **3000**: Frontend React
- **5000**: Backend Node.js
- **8888**: Test CA (original)
- **8899**: Test CA adicional (original)

## 📝 Logs e Debugging

### Backend
```bash
# Logs do servidor
cd backend && npm run dev
```

### Frontend
```bash
# Logs do React
npm start
```

### Docker
```bash
# Logs dos containers
docker-compose logs -f
```

## 🚨 Troubleshooting

### Email não está sendo enviado
- Verifique as credenciais no arquivo `.env`
- Confirme que a senha de app foi gerada corretamente
- Teste com um email simples primeiro

### Erro de conexão com backend
- Verifique se o backend está rodando na porta 5000
- Confirme que não há conflitos de porta
- Verifique os logs do backend

### Test CA não acessível
- Confirme que o Test CA está rodando na porta 8888
- Verifique se o docker-compose do Test CA está ativo
- Teste o acesso direto: http://localhost:8888/testca

## 🔄 Desenvolvimento

Para desenvolvimento local:

```bash
# Backend (terminal 1)
cd backend
npm run dev

# Frontend (terminal 2)
npm start
```

## 📋 TODO / Melhorias Futuras

- [ ] Recuperação de senha
- [ ] Múltiplos usuários
- [ ] Logs de auditoria
- [ ] Interface de administração
- [ ] Configuração via interface web
- [ ] Suporte a LDAP/Active Directory

## ⚠️ Notas Importantes

- **Ambiente de Desenvolvimento**: Esta aplicação é para desenvolvimento/teste
- **Configuração Única**: O administrador só pode ser configurado uma vez
- **Backup**: Faça backup do arquivo `backend/admin.json` se necessário
- **Segurança**: Altere o JWT_SECRET em produção
