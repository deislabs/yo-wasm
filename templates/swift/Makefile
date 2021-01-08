# Not sure if this is necesssary, so omiting for now
# DEBUG_OPT = -debug-info-format=dwarf

SWIFTC = swiftc
TARGET ?= wasm32-unknown-wasi
DEST ?= <%= moduleName %>.wasm
SRC_DIR ?= ./src
SDK_DIR ?= "<%= wasiSdkPath %>"

.PHONY: build
build:
	PATH=$(SDK_DIR):$$PATH \
	$(SWIFTC) -target $(TARGET) $(SRC_DIR)/main.swift -o $(DEST) 