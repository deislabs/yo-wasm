# <%= moduleName %>

A WASM hello-world written in Go and compiled into WASM via TinyGo

You will need:
* Go (v1.16 or higher): https://golang.org/doc/install
* TinyGo: https://tinygo.org/getting-started/install
* wasmtime: `curl https://wasmtime.dev/install.sh -sSf | bash`

To init: `make init`
* Just needs running once, this sets up Go module for this project

To test:
* VS Code: `Run Task > TinyGo: Test`
* Command line: `make test`

To build:
* VS Code: `Run Task > TinyGo: Build WASM`
* Command line: `make build`

To run:
* VS Code: go to Run/Debug pane, select `Debug WASM` and run
* Command line: `make run`
