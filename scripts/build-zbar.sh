#!/usr/bin/env bash
set -euo pipefail

source ./submodules/emsdk/emsdk_env.sh 

# Build the wasm variant
bazel build -c opt //app:zbarapp.wasm --config=wasm --sandbox_debug