// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var hg = require('mercury');
var h = require('mercury').h;
var debug = require('debug')('render');
var header = require('./components/header');
var bundles = require('./components/bundles');
var bundle = require('./components/bundle');
var error = require('./components/error');

module.exports = render;

// # render(state)
//
// High-level render function for entire playground app state.
function render(state) {
  return h('.playground', [
    hg.partial(header.render, state, state.channels),
    hg.partial(main, state),
    hg.partial(footer, state, state.channels)
  ]);
}

function main(state, anchor) {
  debug('update %o', state);

  // Possible scenarios to be considered:
  //
  // * loading/initial state
  // * a list of bundles
  // * a single bundle
  // * an error
  //
  // Currently there are only two screens to show:
  //
  // 1. A list of bundles
  // 2. A single bundle
  var partial;

  // If there is a uuid show a single bundle
  if (state.uuid) {
    partial = hg.partial(bundle.render,
      state.bundles[state.uuid],
      state.channels
    );
  } else if (state.error) {
    // Temporary error rendering until vanadium/issues#294 is resolved.
    partial = hg.partial(error.render, state.error);
  } else {
    // By default show a list of bundles
    partial = hg.partial(bundles.render, state.bundles);
  }

  return h('main', [ partial ]);
}

function footer(state, channels) {
  return h('footer', [
    h('nav.main', [
      h('a', {
        href: 'https://github.com/vanadium/issues/issues/'
      }, 'File a bug'),
      h('a', {
        href: 'https://vanadium.github.io/tos.html'
      }, 'Terms of service')
    ]),
    h('nav.social', [
      h('a.icon-github', { href: 'https://github.com/vanadium' }),
      h('a.icon-twitter', {
        href: 'https://twitter.com/vanadiumteam'
      })
    ])
  ]);
}
