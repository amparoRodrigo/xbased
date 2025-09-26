import React, { useState, useEffect } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import AdminSetup from './components/AdminSetup';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const [appState, setAppState] = useState('loading'); // loading, setup, login, authenticated
  // eslint-disable-next-line no-unused-vars
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const response = await fetch('/api/setup-status');
      const data = await response.json();
      
      if (data.configured) {
        // Verificar se já está logado
        const token = localStorage.getItem('authToken');
        if (token) {
          // Verificar se token é válido
          try {
            const verifyResponse = await fetch('/api/verify-token', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (verifyResponse.ok) {
              const userData = await verifyResponse.json();
              setUser(userData.user);
              setAppState('authenticated');
              return;
            } else {
              // Token inválido, remover
              localStorage.removeItem('authToken');
              localStorage.removeItem('userEmail');
            }
          } catch (err) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
          }
        }
        
        setAppState('login');
      } else {
        setAppState('setup');
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error);
      setAppState('setup'); // Fallback para setup se houver erro
    }
  };

  const handleSetupComplete = () => {
    setAppState('login');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setAppState('authenticated');
    
    // Pequeno delay para mostrar o loading antes do redirecionamento
    setTimeout(() => {
      // Redireciona para a aplicação testca
      window.location.href = 'http://localhost:8888/testca';
    }, 1500);
  };

  // eslint-disable-next-line no-unused-vars
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    setUser(null);
    setAppState('login');
  };

  switch (appState) {
    case 'loading':
      return <LoadingSpinner message="Verificando configuração..." />;
    
    case 'setup':
      return <AdminSetup onSetupComplete={handleSetupComplete} />;
    
    case 'login':
      return <LoginForm onLogin={handleLogin} />;
    
    case 'authenticated':
      return <LoadingSpinner message="Redirecionando para Test CA..." />;
    
    default:
      return <LoadingSpinner message="Carregando..." />;
  }

  
}

export default App;
