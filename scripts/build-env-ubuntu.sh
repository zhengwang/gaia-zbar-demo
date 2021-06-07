#!/bin/bash
set -euo pipefail

export SUBMODULE_HOME=/opt/submodules
export MSGPACK_HOME=$SUBMODULE_HOME/msgpack-c/
export MSGPACK=$MSGPACK_HOME/include
export BOOST=$SUBMODULE_HOME/boost
export OPENCV=$SUBMODULE_HOME/opencv