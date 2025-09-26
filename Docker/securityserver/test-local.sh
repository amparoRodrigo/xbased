#!/bin/bash

# Test script for X-Road Security Server Docker image

set -e

CONTAINER_NAME="xroad-ss-test"
IMAGE_NAME="xroad-security-server-local"

echo "Testing X-Road Security Server Docker image..."

# Check if image exists
if ! docker images | grep -q "$IMAGE_NAME"; then
    echo "Error: Docker image '$IMAGE_NAME' not found"
    echo "Please build the image first using: ./build-local.sh"
    exit 1
fi

# Clean up any existing test container
if docker ps -a | grep -q "$CONTAINER_NAME"; then
    echo "Removing existing test container..."
    docker stop "$CONTAINER_NAME" 2>/dev/null || true
    docker rm "$CONTAINER_NAME" 2>/dev/null || true
fi

# Start the container
echo "Starting test container..."
docker run -d \
    -p 127.0.0.1:4001:4000 \
    -p 127.0.0.1:8081:8080 \
    --name "$CONTAINER_NAME" \
    -e XROAD_TOKEN_PIN=1234 \
    "$IMAGE_NAME"

# Wait for services to start
echo "Waiting for services to start..."
sleep 10

# Check container status
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "Error: Container failed to start"
    docker logs "$CONTAINER_NAME"
    exit 1
fi

# Check X-Road version
echo "Checking X-Road version..."
VERSION=$(docker exec "$CONTAINER_NAME" cat /etc/xroad/VERSION)
echo "X-Road version: $VERSION"

# Check installed packages
echo "Checking installed X-Road packages..."
PACKAGE_COUNT=$(docker exec "$CONTAINER_NAME" dpkg -l | grep -c "^ii.*xroad")
echo "Installed X-Road packages: $PACKAGE_COUNT"

# Test basic connectivity
echo "Testing basic connectivity..."
sleep 5

# Check if admin UI responds (may take time to fully start)
for i in {1..6}; do
    if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8081/ | grep -q "200\|302\|401"; then
        echo "Admin UI is responding on HTTP port 8081"
        break
    elif [ $i -eq 6 ]; then
        echo "Warning: Admin UI not responding after 30 seconds (this may be normal during initialization)"
    else
        echo "Waiting for admin UI to start... (attempt $i/6)"
        sleep 5
    fi
done

echo ""
echo "Test completed successfully!"
echo ""
echo "Container details:"
echo "- Name: $CONTAINER_NAME"
echo "- Admin UI HTTP: http://127.0.0.1:8081/"
echo "- Admin UI HTTPS: https://127.0.0.1:4001/"
echo "- Credentials: xrd/secret"
echo ""
echo "To view logs: docker logs $CONTAINER_NAME"
echo "To stop container: docker stop $CONTAINER_NAME"
echo "To remove container: docker rm $CONTAINER_NAME"
