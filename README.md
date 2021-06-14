# gaia-zbar-demo

## Quick Demo
```
https://zhengwang.github.io/gaia-zbar-demo/#/
```

<hr />
A webassembly project of barcode scanner using Opencv and Zbar library.

This project is built based on
1. EMSDK 2.0.23
1. Zbar 0.10
1. OpenCV 4.5.2-dev
<hr/>

## Development note
### Build ZBar emscripten static lib
* Download zbar source code from [ZBar](http://zbar.sourceforge.net/)
* Build zbar lib using emscripten toolchain
```
emconfigure ${ZBAR_SOURCE}/configure \
        --without-x --without-xshm \
		--without-xv --without-jpeg --without-libiconv-prefix \
		--without-imagemagick --without-npapi --without-gtk \
		--without-python --without-qt --without-xshm --disable-video \
		--disable-pthread --disable-assert --disable-shared

emmake make CFLAGS=-Os CXXFLAGS=-Os \
		DEFS="-DZNO_MESSAGES -DHAVE_CONFIG_H"
```
* Zbar static lib file is under `${ZBAR_SOURCE}/zbar/.libs`.

<hr />

### Build opencv static library using EMSDK
Refer `scripts/build-opencv-lib.sh` to build em static lib.
```
emcmake python3 ./opencv/platforms/js/build_js.py build_js \
    --build_wasm \
    --cmake_option="-DCMAKE_TOOLCHAIN_FILE='/Volumes/data/proj_shell/emsdk/upstream/emscripten/cmake/Modules/Platform/Emscripten.cmake'" \
    --cmake_option="-DCMAKE_CROSSCOMPILING_EMULATOR='/Volumes/data/proj_shell/emsdk/node/14.15.5_64bit/bin/node'"
```
<hr/>

### Setup EMSDK submodules

> npm run em:setup

### Build boost emscripten static lib
1. Generate boost .bc files
```
./b2 toolset=emscripten \
    link=static \
    variant=release \
    threading=single \
    runtime-link=static \
    wave % <-- boost module name
```
2. archive lib bc file(s) into static library
```
emar q libboost_wave.a \
    bin.v2/libs/wave/build/emscripten-2.0.23/release/link-static/visibility-hidden/*.bc
```
<hr/>

