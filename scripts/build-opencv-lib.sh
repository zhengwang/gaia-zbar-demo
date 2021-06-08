#!/usr/bin/env bash

emcmake python3 ./opencv/platforms/js/build_js.py build_js --build_wasm --cmake_option="-DCMAKE_TOOLCHAIN_FILE='/Volumes/data/proj_shell/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake'" --cmake_option="-DCMAKE_CROSSCOMPILING_EMULATOR='/Volumes/data/proj_shell/emsdk/node/14.15.5_64bit/bin/node'"