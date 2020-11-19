# generator-wasm [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

Generate WASM modules that can be pushed to OCI registries, for example
for use with [Krustlet](https://github.com/deislabs/krustlet).

## Installation

First, install [Yeoman](http://yeoman.io) using [npm](https://www.npmjs.com/) 
(we assume you have pre-installed [node.js](https://nodejs.org/)).
Then install `generator-wasm` also using `npm`.

```bash
npm install -g yo
npm install -g generator-wasm
```

Then generate your new project:

```console
$ mkdir myproject
$ cd myproject
$ yo wasm
```

## Setting up a project

After you run the generator, it displays any language-specific instructions
to get started - for examples, tools you need to have installed. The generated
`README.md` may also contain information on compiling or running the project.

## Working on the generated project

The generated projects contain configuration files for Visual Studio Code to help
with the process of editing and testing.  You should be able to load a
generated project into VS Code and have it:

* Prompt you to install recommended extensions (don't just ignore these -
  they may be needed for debugging!)
* Provide a `Build WASM` task (available via the `Run Task` command)
* Provide a `Debug WASM` debug configuration (available via the Run pane)

_NOTE: These are not yet provided for the AssemblyScript template._

## Publishing a project

The project contains a GitHub action (in `.github/workflows/release.yml`) that publishes
your WASM module to an OCI registry.

* It publishes a `canary` version whenever you push to `main`.
* It publishes a versioned module whenever you create a tag from `main`
  whose name begins with `v` (e.g. `v1.1.0`).

_NOTE: `release.yml` watches the `main` branch.  If your repository uses the name
`master` then you must change this in the workflow file._

At the moment, the Yeoman generator only sets up publishing for
Azure Container Registry, but we'll expand this repertoire over time
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

_NOTE: during testing we sometimes see that GitHub workflows do not run on the initial
commit, or if you tag the initial commit. It usually works - but you **may** need to
push a change to `main` before the workflows will run._

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Running from source

If you would like to run the generator from source, or modify it, you can clone
the repo and run `npm install && npm run compile && npm link` 
to hook it up to Yeoman so that you can run `yo wasm`.

```bash
npm install -g yo
npm install && npm run compile && npm link
```

[npm-image]: https://badge.fury.io/js/generator-wasm.svg
[npm-url]: https://npmjs.org/package/generator-wasm
[travis-image]: https://travis-ci.com/deislabs/generator-wasm.svg?branch=master
[travis-url]: https://travis-ci.com/deislabs/generator-wasm
[daviddm-image]: https://david-dm.org/deislabs/generator-wasm.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/deislabs/generator-wasm
