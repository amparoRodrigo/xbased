import React, { useState } from 'react';
import './AdminSetup.css';

const AdminSetup = ({ onSetupComplete }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Todos os campos são obrigatórios');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email inválido');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/setup-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSetupComplete();
        }, 3000);
      } else {
        setError(data.error || 'Erro ao configurar administrador');
      }
    } catch (err) {
      setError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="setup-container">
        <div className="setup-success">
          <div className="success-icon">✅</div>
          <h2>Configuração Concluída!</h2>
          <p>Administrador configurado com sucesso.</p>
          <p>As credenciais foram enviadas para seu email.</p>
          <div className="loading-dots">
            <span>Redirecionando</span>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-container">
      <div className="setup-image">
        <div className="image-placeholder">
        </div>
      </div>
      
      <div className="setup-form-container">
        <div className="setup-form">
          <h1>Configuração Inicial</h1>
          <p className="subtitle">Configure o administrador do Test CA</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email do Administrador</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@exemplo.com"
                required
                disabled={isLoading}
              />
              <small>As credenciais serão enviadas para este email</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Digite a senha novamente"
                required
                disabled={isLoading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button 
              type="submit" 
              className="setup-button"
              disabled={isLoading}
            >
              {isLoading ? 'Configurando...' : 'Configurar Administrador'}
            </button>
          </form>
          
          <div className="setup-info">
            <div className="info-box">
              <h4>ℹ️ Informações Importantes</h4>
              <ul>
                <li>Esta configuração só pode ser feita uma vez</li>
                <li>As credenciais serão enviadas por email</li>
                <li>Guarde as credenciais em local seguro</li>
                <li>Você poderá alterar a senha após o primeiro login</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetup;
