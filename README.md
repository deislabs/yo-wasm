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

## Usage

The project contains a GitHub workflow (in `.github/workflows/release.yml`) that publishes
your WASM module to an OCI registry.  At the moment, the Yeoman generator only sets
this up for Azure Container Registry, but we'll expand this repertoire over time
(and it should be reasonably easy to adapt the ACR steps to other registries).
The publish workflow needs to know three things:

* The name of the registry to publish to.  For ACR, this is set via the `ACR_NAME`
  variable in `release.yml` (and _excludes_ the `.azurecr.io` suffix).  The generator
  sets this up for you, but if you want to change the publish registry, this is where
  to do it.
* The credentials for pushing to the registry.  For ACR, this is the ID and password
  of a service principal with push permission to the registry.  You can create such
  a service principal using the script at https://bit.ly/2ZsmeQS, but you **MUST**
  change the `az ad sp create --role` parameter to `acrpush`.  This will print an
  ID and password.  Then follow the instructions at https://bit.ly/2ZqS3cB to create
  GitHub secrets named `ACR_SP_ID` and `ACR_SP_PASSWORD`.  The release workflow
  will use those secrets to push the WASM module to ACR.

The `release.yml` workflow is set up to publish a build as `canary` whenever you
push or merge a PR to your `main` branch, and to publish a versioned module
whenever you create a tag whose name begins with `v` (e.g. `v1.1.0`).

_NOTE: `release.yml` watches the `main` branch.  If your repository uses the name
`master` then you must change this in the workflow file._

_NOTE: during testing we sometimes see that GitHub workflows do not run on the initial
commit, or if you tag the initial commit. You may need to push a change to `main` before
the workflows will run._

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
