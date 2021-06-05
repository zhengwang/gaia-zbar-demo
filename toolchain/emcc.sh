#!/usr/bin/env bash
set -euo pipefail

export EM_EXCLUSIVE_CACHE_ACCESS=1
export EMCC_SKIP_SANITY_CHECK=1

export EM_CACHE="external/emsdk/emsdk/upstream/emscripten/cache"
export TEMP_DIR="tmp"

external/emsdk/emsdk/upstream/emscripten/em++ "$@"