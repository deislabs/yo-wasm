# generator-wasm-oci-rust [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

Generate WASM modules that can be pushed to OCI registries, for example
for use with [Krustlet](https://github.com/deislabs/krustlet).

**This generator is currently work in progress.  You cannot yet install it using npm.**
If you would like to try it, you can clone
the repo and run `npm link` to hook it up to Yeoman so that you can run `yo wasm-oci-rust`.
Or let us know so that we're motivated to get it ready for a proper release!

## Installation

First, install [Yeoman](http://yeoman.io) and generator-wasm-oci-rust using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-wasm-oci-rust
```

Then generate your new project:

```bash
yo wasm-oci-rust
```

## Code of Conduct

This project has adopted the [Microsoft Open Source Code of
Conduct](https://opensource.microsoft.com/codeofconduct/).

For more information see the [Code of Conduct
FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact
[opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

[npm-image]: https://badge.fury.io/js/generator-wasm-oci-rust.svg
[npm-url]: https://npmjs.org/package/generator-wasm-oci-rust
[travis-image]: https://travis-ci.com/deislabs/generator-wasm-oci-rust.svg?branch=master
[travis-url]: https://travis-ci.com/deislabs/generator-wasm-oci-rust
[daviddm-image]: https://david-dm.org/deislabs/generator-wasm-oci-rust.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/deislabs/generator-wasm-oci-rust
