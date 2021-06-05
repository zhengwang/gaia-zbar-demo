package(default_visibility = ["//visibility:public"])

DEFAULT_EMSCRIPTEN_LINKOPTS = [
	"--no-entry",    
	"-s ERROR_ON_UNDEFINED_SYMBOLS=1",
	"-s EXPORTED_FUNCTIONS=['_malloc','_free']",            
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
    linkopts = DEFAULT_EMSCRIPTEN_LINKOPTS + WASM_LINKOPTS,
    deps = ["@msgpack//:msgpack_lib"]
)