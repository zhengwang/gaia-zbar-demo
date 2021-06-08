# gaia-opencv

Template for bazel project

This project is built based on
1. EMSDK 2.0.23
1. OpenCV 4.5.2-dev

## Build opencv static library using EMSDK
Refer `scripts/build-opencv-lib.sh` to build em static lib.

## Setup EMSDK submodules
1. 
> npm run em:setup

## Build boost emscripten static lib
1. Generate boost .bc files
> ./b2 toolset=emscripten link=static variant=release threading=single runtime-link=static wave
2. archive lib bc file(s) into static library
> emar q libboost_wave.a bin.v2/libs/wave/build/emscripten-2.0.23/release/link-static/visibility-hidden/*.bc
