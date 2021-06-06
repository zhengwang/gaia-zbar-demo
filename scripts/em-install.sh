#!/usr/bin/env bash
set -euo pipefail

# Setup llvm
cd submodules/emsdk \
&& ./emsdk install latest \
&& ./emsdk activate latest \
&& cd ../../