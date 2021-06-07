load("@bazel_tools//tools/build_defs/cc:action_names.bzl", "ACTION_NAMES")
load("@bazel_tools//tools/cpp:cc_toolchain_config_lib.bzl",
    "feature",
    "flag_group",
    "flag_set",
    "tool_path"
)

def _emsdk_impl(ctx):
    print("--------- emsdk_config -----------")
    if "EMSDK" not in ctx.os.environ or ctx.os.environ["EMSDK"].strip() == "":
        fail("The environment variable EMSDK is not found. " +
             "Did you run source ./emsdk_env.sh ?")
    path = ctx.os.environ["EMSDK"]
    ctx.symlink(path, "emsdk")
    ctx.file("BUILD", """
filegroup(
    name = "all",
    srcs = glob(["emsdk/**"]),
    visibility = ["//visibility:public"],
)
""")

emsdk_configure = repository_rule(
    implementation = _emsdk_impl,
    local = True,
)


def _msgpackc_impl(ctx):
    print(" ------------- msgpack c configure -------------- ")
    if "MSGPACK" not in ctx.os.environ or ctx.os.environ["MSGPACK"].strip() == "":
        fail("The environment variable MSGPACK is not found. ")
    path = ctx.os.environ["MSGPACK"]
    ctx.symlink(path, "msgpack")
    ctx.file("BUILD", """
filegroup(
    name = "all",
    srcs = glob(["msgpack/**"]),
    visibility = ["//visibility:public"],
)

cc_library(
    name = "msgpack_lib",
    srcs = glob(["msgpack/**"]),
    hdrs = glob(["msgpack/**"]),
    strip_include_prefix = "msgpack",
    visibility = ["//visibility:public"],
    deps = ["@boost//:boost_lib"]) 
""")


msgpack_configure = repository_rule(
    implementation = _msgpackc_impl,
    local = True
)


def _boost_impl(ctx):
    print(" --------------- boost configure ----------------- ")
    if "BOOST" not in ctx.os.environ or ctx.os.environ["BOOST"].strip() == "":
        fail("The environment variable MSGPACK is not found. ")
    path = ctx.os.environ["BOOST"]
    ctx.symlink(path, "boost")
    ctx.file("BUILD", """
filegroup(
    name = "all",
    srcs = glob(["boost/**"]),
    visibility = ["//visibility:public"],
)

cc_library(
    name = "boost_lib",
    srcs = glob(["boost/boost/**", "boost/srcs/**"]),    
    hdrs = glob(["boost/boost/**"]),    
    strip_include_prefix = "boost",
    visibility = ["//visibility:public"])    
""")


boost_configure = repository_rule(
    implementation = _boost_impl,
    local = True
)

def _opencv_impl(ctx):
    print(" ------------- opencv configure ---------------- ")
    if "OPENCV" not in ctx.os.environ or ctx.os.environ["OPENCV"].strip() == "":
        fail("The environment variable OPENCV is not found. ")
    path = ctx.os.environ["OPENCV"]
    ctx.symlink(path, "opencv")
    ctx.file("BUILD", """
filegroup(
    name = "all",
    srcs = glob(["opencv/**"]),
    visibility = ["//visibility:public"],
)

cc_library(
    name = "opencv_lib",
    # srcs = glob(["opencv/core/**"]),    
    # hdrs = glob(["opencv/core/include/**"]),        
    # strip_include_prefix = "opencv/core/include",
    srcs = glob(["opencv/libs/**"]),
    hdrs = glob(["opencv/includes/**"]),
    strip_include_prefix = "opencv/includes",
    visibility = ["//visibility:public"])    
""")

opencv_configure = repository_rule(
    implementation = _opencv_impl,
    local = True
)


def _impl(ctx):
    print(" ----------- cc_toolchain_config ------------- ")
    tool_paths = [
        tool_path(
            name = "gcc", 
            path = "emcc.sh"
        ),
        tool_path(
            name = "ld",
            path = "emcc.sh"
        ),
        tool_path(
            name = "ar",
            path = "false.sh"
        ),
        tool_path(
            name = "cpp",
            path = "false.sh"
        ),
        tool_path(
            name = "gcov",
            path = "false.sh"
        ),
        tool_path(
            name = "nm",
            path = "false.sh"
        ),
        tool_path(
            name = "objdump",
            path = "false.sh"
        ),
        tool_path(
            name = "strip",
            path = "false.sh"
        )
    ]

    builtin_sysroot = "external/emsdk/emsdk/upstream/emscripten/cache/sysroot/"

    cxx_builtin_include_directories = [
        "external/emsdk/emsdk/upstream/emscripten/cache/sysroot/include/c++/v1",     
        "external/emsdk/emsdk/upstream/emscripten/cache/sysroot/include/compat",        
        "external/emsdk/emsdk/upstream/emscripten/cache/sysroot/include",    
        "external/emsdk/emsdk/upstream/lib/clang/13.0.0/include",
    ]

    toolchain_include_directories_feature = feature(
        name = "toolchain_include_directories",
        enabled = True,
        flag_sets = [
            flag_set(
                actions = [
                    ACTION_NAMES.assemble,
                    ACTION_NAMES.preprocess_assemble,
                    ACTION_NAMES.linkstamp_compile,
                    ACTION_NAMES.c_compile,
                    ACTION_NAMES.cpp_compile,
                    ACTION_NAMES.cpp_header_parsing,
                    ACTION_NAMES.cpp_module_compile,
                    ACTION_NAMES.cpp_module_codegen,
                    ACTION_NAMES.lto_backend,
                    ACTION_NAMES.clif_match,
                ],
                flag_groups = [
                    flag_group(
                        flags = [                            
                            # The clang compiler comes with a definition of
                            # max_align_t struct in $emsdk/upstream/lib/clang/13.0.0/include/__stddef_max_align_t.h.
                            # It conflicts with the one defined in
                            # $emsdk/upstream/emscripten/cache/sysroot/include/bits/alltypes.h.
                            # We need both include paths to make things work.
                            #
                            # To workaround this, we are defining the following
                            # symbol through compiler flag so that the max_align_t
                            # defined in clang's header file will be skipped.
                            "-D",
                            "__CLANG_MAX_ALIGN_T_DEFINED",
                            # Other cxx header include path.
                            "-isystem",
                            "external/emsdk/emsdk/upstream/lib/clang/13.0.0/include",                            
                            "-isystem",
                            "external/emsdk/emsdk/upstream/emscripten/cache/sysroot/include/c++/v1",
                            "-isystem",
                            "external/emsdk/emsdk/upstream/emscripten/cache/sysroot/include/compat",
                            "-isystem",
                            "external/emsdk/emsdk/upstream/emscripten/cache/sysroot/include",                                       
                        ] 
                    )
                ]
            )
        ]
    )

    return cc_common.create_cc_toolchain_config_info(
        ctx = ctx,
        toolchain_identifier = "wasm-toolchain",
        host_system_name = "i686-unknown-linux-gnu",
        target_system_name = "wasm-unknown-emscripten",
        target_cpu = "wasm",
        target_libc = "musl/js",
        compiler = "emscripten",
        abi_version = "emscripten_syscalls",
        abi_libc_version = "default",
        tool_paths = tool_paths,
        features = [toolchain_include_directories_feature],
        builtin_sysroot = builtin_sysroot,
        cxx_builtin_include_directories = cxx_builtin_include_directories
    )


cc_toolchain_config = rule(
    implementation = _impl,
    attrs = {},
    provides = [CcToolchainConfigInfo]
)