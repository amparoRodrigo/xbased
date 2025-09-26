const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const fs = require('fs-extra');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'testca-secret-key-change-in-production';

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://54.207.182.74:3000',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Arquivo para armazenar dados do admin
const ADMIN_DATA_FILE = path.join(__dirname, 'admin.json');

// Configuração do email
const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail', // ou outro provedor
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Verificar se admin já foi configurado
const isAdminConfigured = async () => {
  try {
    return await fs.pathExists(ADMIN_DATA_FILE);
  } catch (error) {
    return false;
  }
};

// Salvar dados do admin
const saveAdminData = async (email, hashedPassword) => {
  const adminData = {
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  };
  await fs.writeJson(ADMIN_DATA_FILE, adminData);
};

// Carregar dados do admin
const loadAdminData = async () => {
  try {
    return await fs.readJson(ADMIN_DATA_FILE);
  } catch (error) {
    return null;
  }
};

// Enviar email com credenciais
const sendCredentialsEmail = async (email, password) => {
  const transporter = createEmailTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Test CA - Credenciais de Administrador',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Test CA - X-Road</h2>
        <h3>Credenciais de Administrador Configuradas</h3>
        
        <p>Suas credenciais de administrador para o Test CA foram configuradas com sucesso:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Senha:</strong> ${password}</p>
        </div>
        
        <p><strong>Acesso:</strong> <a href="http://localhost:3000">http://localhost:3000</a></p>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <p><strong>⚠️ Importante:</strong></p>
          <ul>
            <li>Guarde essas credenciais em local seguro</li>
            <li>Altere a senha após o primeiro acesso</li>
            <li>Este email contém informações sensíveis</li>
          </ul>
        </div>
        
        <p>Após fazer login, você será redirecionado para: <strong>http://localhost:8888/testca</strong></p>
        
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          Este é um email automático do sistema Test CA. Não responda a este email.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Rotas da API

// Verificar status da configuração
app.get('/api/setup-status', async (req, res) => {
  try {
    const configured = await isAdminConfigured();
    res.json({ configured });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar status de configuração' });
  }
});

// Configurar administrador inicial
app.post('/api/setup-admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se já foi configurado
    if (await isAdminConfigured()) {
      return res.status(400).json({ error: 'Administrador já foi configurado' });
    }

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salvar dados
    await saveAdminData(email, hashedPassword);

    // Enviar email (se configurado)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await sendCredentialsEmail(email, password);
      } catch (emailError) {
        console.error('Erro ao enviar email:', emailError);
        // Continua mesmo se o email falhar
      }
    }

    res.json({ 
      success: true, 
      message: 'Administrador configurado com sucesso',
      emailSent: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
    });

  } catch (error) {
    console.error('Erro ao configurar admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se admin foi configurado
    if (!await isAdminConfigured()) {
      return res.status(400).json({ error: 'Administrador não foi configurado ainda' });
    }

    // Carregar dados do admin
    const adminData = await loadAdminData();
    if (!adminData) {
      return res.status(500).json({ error: 'Erro ao carregar dados do administrador' });
    }

    // Verificar email
    if (email !== adminData.email) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, adminData.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { email: adminData.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: { email: adminData.email }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verificar token
app.get('/api/verify-token', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Acesso local: http://localhost:${PORT}`);
  console.log(`🌐 Acesso público: http://54.207.182.74:${PORT}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER ? 'Sim' : 'Não'}`);
});

module.exports = app;
