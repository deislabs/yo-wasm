# <%= moduleName %>

A WASM hello-world with a publish action

You will need:
* Rust: https://www.rust-lang.org/tools/install
* The `wasm32-wasi` target: `rustup target add wasm32-wasi`

To build:
* VS Code: `Run Task > Rust: Build WASM`
* Command line: `cargo build-wasm`

To run:
* VS Code: go to Run/Debug pane, select `Debug WASM` and run
* Command line: `wasmtime ./target/wasm32-wasi/debug/<%= moduleName %>.wasm`
