#!/usr/bin/env bash
set -euo pipefail

source ./submodules/emsdk/emsdk_env.sh 

# Build the wasm variant
bazel build -c opt //app:cvcanny.wasm --config=wasm --sandbox_debug