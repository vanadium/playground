// +build OMIT
package main

import (
	"fmt"

	_ "v.io/core/veyron/profiles"
	"v.io/core/veyron2"
	"v.io/core/veyron2/rt"

	"pingpong"
)

func main() {
	runtime, err := rt.New()
	if err != nil {
		panic(err)
	}
	defer runtime.Cleanup()
	ctx := runtime.NewContext()
	log := veyron2.GetLogger(ctx)

	s := pingpong.PingPongClient("pingpong")
	pong, err := s.Ping(runtime.NewContext(), "PING")
	if err != nil {
		log.Fatal("error pinging: ", err)
	}
	fmt.Println(pong)
}
