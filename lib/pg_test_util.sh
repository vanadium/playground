#!/bin/bash

# Utilities for testing the playground builder tool.
# Used by tests in v.io/playground and veyron-www.

source "$(go list -f {{.Dir}} v.io/core/shell/lib)/shell_test.sh"

# Sets up environment variables required for the tests.
setup_environment() {
  export GOPATH="$(pwd):$(v23 env GOPATH)"
  export VDLPATH="$(pwd):$(v23 env VDLPATH)"
  export PATH="$(pwd):${shell_test_BIN_DIR}:${VANADIUM_ROOT}/environment/cout/node/bin:${PATH}"

  # We unset all environment variables that supply a principal in order to
  # simulate production playground setup.
  unset VEYRON_CREDENTIALS
  unset VEYRON_AGENT_FD
}

# Installs the release/javascript/core library and makes it accessible to
# Javascript files in the Vanadium playground test under the module name
# 'veyron'.
install_vanadium_js() {
  # TODO(nlacasse): Once release/javascript/core is publicly available in npm, replace this
  # with "npm install vanadium".

  pushd "${VANADIUM_ROOT}/release/javascript/vom"
  npm link
  popd
  pushd "${VANADIUM_ROOT}/release/javascript/core"
  npm link vom
  npm link
  popd
  npm link veyron
}

# Installs the pgbundle tool.
install_pgbundle() {
  pushd "${VANADIUM_ROOT}/release/javascript/pgbundle"
  npm link
  popd
  npm link pgbundle
}

# Installs various go binaries.
build_go_binaries() {
  shell_test::build_go_binary 'v.io/core/veyron/tools/principal'
  shell_test::build_go_binary 'v.io/core/veyron/services/proxy/proxyd'
  shell_test::build_go_binary 'v.io/core/veyron/services/mounttable/mounttabled'
  shell_test::build_go_binary 'v.io/core/veyron2/vdl/vdl'
  shell_test::build_go_binary 'v.io/playground/builder'
  shell_test::build_go_binary 'v.io/wspr/veyron/services/wsprd'
}

# Bundles a playground example and tests it using builder.
# $1: root directory of example to test
# $2: arguments to call builder with
test_pg_example() {
  local -r PGBUNDLE_DIR="$1"
  local -r BUILDER_ARGS="$2"

  ./node_modules/.bin/pgbundle "${PGBUNDLE_DIR}"

  # Create a fresh dir to run builder in.
  local -r ORIG_DIR=$(pwd)
  pushd $(shell::tmp_dir)
  ln -s "${ORIG_DIR}/node_modules" ./  # for release/javascript/core
  "${shell_test_BIN_DIR}/builder" ${BUILDER_ARGS} < "${PGBUNDLE_DIR}/bundle.json" 2>&1 | tee builder.out
  # Move builder output to original dir for verification.
  mv builder.out "${ORIG_DIR}"
  popd
}