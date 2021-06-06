#!/usr/bin/env bash
set -euo pipefail

# Add emscripten as submodule
cd submodules \
&& git submodule add https://github.com/emscripten-core/emsdk.git
