// Copyright 2015 The Vanadium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// +build ignore

package main

import (
	"fmt"

	"v.io/v23"
	"v.io/v23/context"
	"v.io/v23/rpc"
	"v.io/v23/security"
	"v.io/x/lib/vlog"
	"v.io/x/ref/lib/signals"
	_ "v.io/x/ref/runtime/factories/roaming"
	"v.io/x/ref/test"

	"pingpong"
)

type pongd struct{}

func (f *pongd) Ping(ctx *context.T, call rpc.ServerCall, message string) (result string, err error) {
	remote, _ := security.RemoteBlessingNames(ctx, call.Security())
	fmt.Printf("%v: %q\n", remote, message)
	return "PONG", nil
}

func main() {
	ctx, shutdown := test.V23Init()
	defer shutdown()

	serverPong := pingpong.PingPongServer(&pongd{})
	ctx, s, err := v23.WithNewServer(ctx, "pingpong", serverPong, nil)
	if err != nil {
		vlog.Fatal("failure creating server: ", err)
	}

	fmt.Printf("Listening at: %v\n", s.Status().Endpoints[0])
	fmt.Printf("Serving pingpong\n")

	// Wait forever.
	<-signals.ShutdownOnSignals(ctx)
}
