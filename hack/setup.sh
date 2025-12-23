#!/bin/bash
set -e

# hack/setup.sh - Setup isolated test environment

REPO_ROOT=$(pwd)
TEST_DIR="${REPO_ROOT}/../qa-scion"

echo "=== Setting up test environment in ${TEST_DIR} ==="

mkdir -p "${TEST_DIR}"


echo "=== Building scion binary ==="
go build -o "${TEST_DIR}/scion" .

cd "${TEST_DIR}"
git init -q
echo "=== Initializing grove ==="
./scion grove init

echo "=== Setup Complete ==="
ls -A1 .scion
