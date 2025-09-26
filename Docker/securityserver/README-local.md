# X-Road Security Server Docker Image - Local Package Build

This directory contains the configuration to build an X-Road Security Server Docker image using locally built .deb packages from `/src/packages/build/ubuntu22.04/`.

## Prerequisites

1. **Build X-Road packages first:**
   ```bash
   cd ../../src
   ./build_packages.sh
   ```

2. **Verify packages exist:**
   ```bash
   ls -la ../../src/packages/build/ubuntu22.04/*.deb
   ```

## Building the Docker Image

### Automated Build (Recommended)

Use the provided build script:

```bash
./build-local.sh
```

This script will:
- Check for required .deb packages
- Copy packages to the build context
- Build the Docker image tagged as `xroad-security-server-local`

### Manual Build

If you prefer to build manually:

```bash
# Copy packages to build context
mkdir -p packages
cp ../../src/packages/build/ubuntu22.04/*.deb packages/

# Build the image
docker build -t xroad-security-server-local .
```

## Testing the Image

### Automated Test

Use the provided test script:

```bash
./test-local.sh
```

### Manual Test

```bash
# Run the container
docker run -d \
    -p 127.0.0.1:4000:4000 \
    -p 127.0.0.1:8080:8080 \
    --name my-ss \
    -e XROAD_TOKEN_PIN=1234 \
    xroad-security-server-local

# Check status
docker ps
docker logs my-ss

# Access admin UI
# HTTP: http://127.0.0.1:8080/
# HTTPS: https://127.0.0.1:4000/
# Credentials: xrd/secret
```

## Configuration

The Dockerfile is configured to:

- Use Ubuntu 24.04 as base image
- Install X-Road packages from local .deb files
- Set up all required services and dependencies
- Create necessary user accounts
- Configure supervisor for service management

### Installed Packages

The image includes these X-Road packages:
- xroad-securityserver
- xroad-autologin
- xroad-addon-opmonitoring
- xroad-addon-hwtokens
- softhsm2 (for hardware token simulation)

### Default Configuration

- Admin UI credentials: `xrd`/`secret`
- Token PIN: Set via `XROAD_TOKEN_PIN` environment variable
- Exposed ports: 8080 (HTTP), 8443 (HTTPS), 4000 (Admin UI), 5432, 5500, 5577, 5558, 80

## Package Versions

The image uses packages built from the current source code with version format:
`7.8.0-0.gitca449eb.ubuntu22.04`

## Troubleshooting

### Build Issues

1. **No packages found:**
   - Ensure packages are built: `cd ../../src && ./build_packages.sh`
   - Check package directory: `ls ../../src/packages/build/ubuntu22.04/`

2. **Docker build fails:**
   - Ensure Docker is running
   - Check available disk space
   - Try cleaning Docker cache: `docker system prune`

### Runtime Issues

1. **Services not starting:**
   - Check container logs: `docker logs <container-name>`
   - Services may take time to initialize (especially database)

2. **Admin UI not accessible:**
   - Wait 1-2 minutes for full startup
   - Check if ports are already in use
   - Verify container is running: `docker ps`

## Files

- `Dockerfile` - Main Docker configuration
- `build-local.sh` - Automated build script
- `test-local.sh` - Automated test script
- `packages/` - Directory for .deb packages (created during build)
- `files/` - Configuration files and scripts
- `build/` - Build artifacts

## Notes

- This configuration is for development and testing purposes
- For production use, consider the X-Road Security Server Sidecar
- The image includes all X-Road addons for comprehensive testing
- Database and configuration are ephemeral unless volumes are mounted
