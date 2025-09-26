# Pacotes X-Road Atualizados

Este diretório contém os pacotes .deb do X-Road versão 7.8.0 construídos para Ubuntu 22.04.

## Pacotes Disponíveis

### Pacotes Base
- `xroad-base_7.8.0-0.gitca449eb.ubuntu22.04_amd64.deb` - Componentes base do X-Road
- `xroad-nginx_7.8.0-0.gitca449eb.ubuntu22.04_amd64.deb` - Servidor web Nginx configurado para X-Road

### Security Server
- `xroad-proxy_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Proxy do Security Server
- `xroad-proxy-ui-api_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Interface de administração do Security Server
- `xroad-securityserver_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Metapacote do Security Server
- `xroad-securityserver-ee_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Configuração específica da Estônia
- `xroad-securityserver-fi_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Configuração específica da Finlândia
- `xroad-securityserver-fo_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Configuração específica das Ilhas Faroé
- `xroad-securityserver-is_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Configuração específica da Islândia

### Central Server
- `xroad-center_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Central Server
- `xroad-center-management-service_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Serviço de gerenciamento do Central Server
- `xroad-center-registration-service_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Serviço de registro do Central Server
- `xroad-centralserver_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Metapacote do Central Server
- `xroad-centralserver-monitoring_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Monitoramento do Central Server

### Componentes de Configuração
- `xroad-confclient_7.8.0-0.gitca449eb.ubuntu22.04_amd64.deb` - Cliente de configuração
- `xroad-confproxy_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Proxy de configuração
- `xroad-signer_7.8.0-0.gitca449eb.ubuntu22.04_amd64.deb` - Serviço de assinatura

### Banco de Dados
- `xroad-database-local_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Configuração de banco de dados local
- `xroad-database-remote_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Configuração de banco de dados remoto

### Monitoramento e Logs
- `xroad-monitor_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Serviço de monitoramento
- `xroad-opmonitor_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Monitor operacional

### Add-ons
- `xroad-addon-hwtokens_7.8.0-0.gitca449eb.ubuntu22.04_amd64.deb` - Suporte a tokens de hardware
- `xroad-addon-messagelog_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Log de mensagens
- `xroad-addon-metaservices_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Metaserviços
- `xroad-addon-opmonitoring_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Monitoramento operacional
- `xroad-addon-proxymonitor_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Monitor do proxy
- `xroad-addon-wsdlvalidator_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Validador WSDL

### Utilitários
- `xroad-autologin_7.8.0-0.gitca449eb.ubuntu22.04_all.deb` - Autologin automático

## Informações da Versão
- **Versão**: 7.8.0-0.gitca449eb
- **Plataforma**: Ubuntu 22.04
- **Data de Build**: $(date)
- **Commit**: ca449eb

## Instalação
Para instalar os pacotes, use o comando `dpkg`:

```bash
sudo dpkg -i <nome_do_pacote>.deb
sudo apt-get install -f  # Para resolver dependências
```

## Observações
- Alguns pacotes podem ter dependências que precisam ser instaladas separadamente
- Recomenda-se fazer backup antes de atualizar uma instalação existente
- Consulte a documentação oficial do X-Road para instruções detalhadas de instalação
