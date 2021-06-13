package(default_visibility = ["//visibility:public"])

DEFAULT_EMSCRIPTEN_LINKOPTS = [
	"--no-entry",    	
	"-s EXPORTED_FUNCTIONS=['_malloc','_free']", 
    "-s USE_PTHREADS=0",         
    # "-s USE_BOOST_HEADERS=1"
    # "-s WASM_OBJECT_FILES=0",
    # "--llvm-lto 1"
	# "-flto",                            # Specify lto (has to be set on for compiler as well)
 #    "--bind",                           # Compiles the source code using the Embind bindings to connect C/C++ and JavaScript
 #    "--closure 1",                      # Run the closure compiler
 #    "-s MALLOC=emmalloc",               # Switch to using the much smaller implementation
 #    "-s ALLOW_MEMORY_GROWTH=0",         # Our example doesn't need memory growth
 #    "-s USE_PTHREADS=0",                # Disable pthreads
 #    "-s ASSERTIONS=0",                  # Turn off assertions
 #    "-s EXPORT_ES6=1",                  # Export as es6 module, used for rollup
 #    "-s MODULARIZE=1",                  # Allows us to manually invoke the initializatio of wasm
 #    "-s EXPORT_NAME=createModule",      # Not used, but good to specify
 #    "-s USE_ES6_IMPORT_META=0",         # Disable loading from import meta since we use rollup
 #    "-s SINGLE_FILE=1",                 # Pack all webassembly into base64
 #    "-s DISABLE_EXCEPTION_CATCHING=1",  # Disable all exception catching
 #    "-s NODEJS_CATCH_EXIT=0",           # We don't have a 'main' so disable exit() catching
]

ERROR_ON_UNDEFINED_SYMBOLS_ON = [
    "-s ERROR_ON_UNDEFINED_SYMBOLS=1",
]

ERROR_ON_UNDEFINED_SYMBOLS_OFF = [
    "-s ERROR_ON_UNDEFINED_SYMBOLS=0",
]

ASMJS_LINKOPTS = [
    "-s WASM=0",                    # Specify asm.js output
]

WASM_LINKOPTS = [
    "-s WASM=1",                    # Specify wasm output
]

MSGPACK_LINKCOPTS = [
    "-Iexternal/boost/boost", 
    "-Iexternal/msgpack/msgpack",
]


cc_binary(
    name = "main.wasm",
    srcs = ["//app/wasm:main.cpp"],
    # copts = MSGPACK_LINKCOPTS,
    linkopts = DEFAULT_EMSCRIPTEN_LINKOPTS + WASM_LINKOPTS + ERROR_ON_UNDEFINED_SYMBOLS_ON,
    deps = ["@msgpack//:msgpack_lib", "@opencv//:opencv_lib"]
)

cc_binary(
    name = "cvcanny.wasm",
    srcs = ["//app/wasm/modules:cv_canny.cpp"],
    linkopts = DEFAULT_EMSCRIPTEN_LINKOPTS + WASM_LINKOPTS + ERROR_ON_UNDEFINED_SYMBOLS_ON,
    deps = ["@opencv//:opencv_lib", "@msgpack//:msgpack_lib"]
)

cc_binary(
    name = "zbarapp.wasm",
    srcs = ["//app/wasm/modules:zb_app.cpp"],
    linkopts = DEFAULT_EMSCRIPTEN_LINKOPTS + WASM_LINKOPTS + ERROR_ON_UNDEFINED_SYMBOLS_ON,
    deps = [
        # "@opencv//:opencv_lib", 
        "@zbar//:zbar_lib"]
)