MODULE ?= <%= moduleName %>
TARGET ?= $(MODULE).wasm
SRC_DIR ?= ./src

default: build

.PHONY: init
init:
	go mod init $(MODULE)

.PHONY: build
build:
	tinygo build -o $(TARGET) -target=wasi $(SRC_DIR)

.PHONY: test
test:
	go test $(SRC_DIR)

.PHONY: run
run:
	wasmtime run $(TARGET) -g