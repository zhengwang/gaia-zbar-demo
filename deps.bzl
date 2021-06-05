load("//toolchain:cc_toolchain_config.bzl", 
    "emsdk_configure",
    "msgpack_configure",
    "boost_configure",)

def app_deps():
    print(" -------- deps ??? -----------")
    # Make all files under submodules/emsdk/* visible to the toolchain. The files are
    # available as external/emsdk/emsdk/*
    emsdk_configure(name = "emsdk")
    msgpack_configure(name = "msgpack")
    boost_configure(name = "boost")