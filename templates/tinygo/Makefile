MODULE ?= <%= moduleName %>
TARGET ?= $(MODULE).wasm
SRC_DIR ?= ./src

default: build

init:
	go mod init $(MODULE)

build:
	tinygo build -o $(TARGET) -target=wasi $(SRC_DIR)

test:
	go test $(SRC_DIR)

run:
	wasmtime run $(TARGET) -g