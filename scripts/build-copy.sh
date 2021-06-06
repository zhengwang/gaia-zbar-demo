#!/usr/bin/env bash

test -f bazel-out/wasm-opt/bin/app/main.wasm && \
    cp -rf bazel-out/wasm-opt/bin/app/main.wasm app/js-app/public/wasm

exit 0