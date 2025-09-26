#!/bin/bash

# Build script for X-Road Security Server Docker image using local packages

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGES_DIR="../../src/packages/build/ubuntu22.04"
LOCAL_PACKAGES_DIR="$SCRIPT_DIR/packages"

echo "Building X-Road Security Server Docker image with local packages..."

# Check if packages exist
if [ ! -d "$PACKAGES_DIR" ]; then
    echo "Error: Packages directory not found at $PACKAGES_DIR"
    echo "Please build the packages first using: cd ../../src && ./build_packages.sh"
    exit 1
fi

# Count .deb files
DEB_COUNT=$(find "$PACKAGES_DIR" -name "*.deb" | wc -l)
if [ "$DEB_COUNT" -eq 0 ]; then
    echo "Error: No .deb packages found in $PACKAGES_DIR"
    echo "Please build the packages first using: cd ../../src && ./build_packages.sh"
    exit 1
fi

echo "Found $DEB_COUNT .deb packages"

# Create local packages directory and copy files
echo "Copying packages to build context..."
mkdir -p "$LOCAL_PACKAGES_DIR"
cp "$PACKAGES_DIR"/*.deb "$LOCAL_PACKAGES_DIR/"

# Build the Docker image
echo "Building Docker image..."
docker build -t xroad-security-server-local .

echo "Build completed successfully!"
echo ""
echo "To run the container:"
echo "docker run -p 4000:4000 -p 8080:8080 --name my-s1 -e XROAD_TOKEN_PIN=1234 xroad-security-server-local"
echo ""
echo "Admin UI will be available at:"
echo "- HTTP: http://0.0.0.0:8080/"
echo "- HTTPS: https://0.0.0.0:4000/"
echo "- Credentials: xrd/secret"
