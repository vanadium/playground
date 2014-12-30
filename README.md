# Building a Docker image and running the playground server locally

## Docker setup

Install Docker:

* Goobuntu: http://go/installdocker
* OS X: https://github.com/boot2docker/osx-installer/releases

On Goobuntu, we recommend overriding the default graph dir (`/var/lib/docker`)
to avoid filling up the root filesystem partition, which is quite small. To do
so, add the following line to your `/etc/default/docker`:

    DOCKER_OPTS="${DOCKER_OPTS} -g /usr/local/google/docker"

Start (or restart) the Docker daemon:

    $ sudo service docker restart

Build the playground Docker image (this will take a while...):

    $ cp ~/.gitcookies $VANADIUM_ROOT/release/go/src/v.io/playground/builder/gitcookies
    $ cp ~/.hgrc $VANADIUM_ROOT/release/go/src/v.io/playground/builder/hgrc
    $ sudo docker build -t playground $VANADIUM_ROOT/release/go/src/v.io/playground/builder/.

Note: If you want to ensure an up-to-date version of Vanadium is installed in
the Docker image, run the above command with the "--no-cache" flag.

Test your image (without running compilerd):

    $ sudo docker run -i playground < /usr/local/google/home/sadovsky/dev/veyron-www/content/playgrounds/code/fortune/ex0-go/bundle.json

## Running the playground server (compilerd)

Install the playground binaries:

    $ v23 go install v.io/playground/...

Run the compiler binary as root:

    $ sudo $VANADIUM_ROOT/release/go/bin/compilerd --shutdown=false --address=localhost:8181

Or, run it without Docker (for faster iterations during development):

    $ cd $(mktemp -d "/tmp/XXXXXXXX")
    $ PATH=$VANADIUM_ROOT/release/go/bin:$PATH compilerd --shutdown=false --address=localhost:8181 --use-docker=false

The server should now be running at http://localhost:8181 and responding to
compile requests at http://localhost:8181/compile.

Add `?pgaddr=//localhost:8181` to any veyron-www page to make its embedded
playgrounds talk to your server. Add `?debug=1` to see debug info from the
builder.
