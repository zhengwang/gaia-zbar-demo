#!/usr/bin/env bash
set -euo pipefail

source ./submodules/emsdk/emsdk_env.sh 

# Build the wasm variant
bazel build -c opt //app:main.wasm --config=wasm