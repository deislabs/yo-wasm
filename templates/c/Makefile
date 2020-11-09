# TODO: Fix wasi-sdk path
WASI_SDK ?= ~/wasi-sdk/wasi-sdk-11.0
CC = $(WASI_SDK)/bin/clang
DEBUG_OPT = -glldb
SYSROOT = $(WASI_SDK)/share/wasi-sysroot/

TARGET ?= <%= moduleName %>.wasm
SRC_DIR ?= ./src

.PHONY: main
main:
	$(CC) $(SRC_DIR)/main.c -o $(TARGET) $(DEBUG_OPT) --sysroot $(SYSROOT)
