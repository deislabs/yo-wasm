# <%= moduleName %>

A WASM hello-world written in C# and compiled into WASM via the [.NET WASI SDK](https://github.com/SteveSandersonMS/dotnet-wasi-sdk).

You will need:
* .NET 7 - Preview 4 or newer: `https://dotnet.microsoft.com/en-us/download/dotnet/7.0`
* wasmtime: `curl https://wasmtime.dev/install.sh -sSf | bash`

To build:
* VS Code: `Run Task > build`
* Command line: `dotnet build`

To run:
* VS Code: `Run Task > run`
* Command line: `dotnet run`
* Command line: `wasmtime bin/Debug/net7.0/<%= moduleName %>.wasm`
