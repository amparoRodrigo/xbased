# X-Road Installation from Local .deb Packages

This guide explains how to install X-Road using local .deb packages instead of remote repositories.

## Prerequisites

- Ubuntu/Debian target systems
- Local .deb packages for X-Road components
- Ansible 7.x or later

## Configuration

### 1. Prepare .deb Packages

Place your X-Road .deb packages in a directory on the Ansible control machine, for example:
```
/opt/xroad-debs/
├── xroad-common_7.4.0-1_all.deb
├── xroad-proxy_7.4.0-1_all.deb
├── xroad-securityserver_7.4.0-1_all.deb
└── ... (other .deb files)
```

### 2. Configure Inventory

Edit your inventory file (e.g., `hosts/local_deb_hosts.txt`) and set:
```ini
[local_deb:vars]
local_deb_source_path=/opt/xroad-debs
variant=vanilla
```

### 3. Installation

Run the installation playbook:
```bash
ansible-playbook -i hosts/local_deb_hosts.txt xroad_local_deb.yml
```

## How It Works

1. **Package Distribution**: Copies .deb packages from control machine to target servers
2. **Local Repository**: Creates a local APT repository on each target server
3. **Dependencies**: Still uses remote repository for dependencies
4. **Installation**: Installs X-Road packages from local repository

## File Structure

- `vars_files/local_deb_repo.yml` - Configuration for local .deb installation
- `roles/local-deb-packages/` - Role for managing local .deb packages
- `xroad_local_deb.yml` - Main playbook for local .deb installation
- `hosts/local_deb_hosts.txt` - Example inventory file

## Limitations

- Only supports Ubuntu/Debian systems
- Dependencies are still downloaded from remote repositories
- Requires sufficient disk space on target servers for package storage
