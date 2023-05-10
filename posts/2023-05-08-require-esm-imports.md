---
title: Require esm imports
---

See what I did there?

I recently encountered a project that used `require` for including external modules, and when upgrading the dependency's major version, I was met with this error:

```
Error [ERR_REQUIRE_ESM]: require() of ES Module .../node_modules/beeper/index.js from .../index.js not supported.
Instead change the require of index.js in .../index.js to a dynamic import() which is available in all CommonJS modules.
    at async Promise.all (index 0) {
  code: 'ERR_REQUIRE_ESM'
}
```

I'm curious about a couple of things here:

- How can a package tell that I'm using `require`? 
- Why would a package require `import` and prevent `require`
- What is the technical implementation for throwing `ERR_REQUIRE_ESM`

## Steps to reproduce

in index.js: 
```js
const beeper = require('beeper');
beeper(3);
```

in package.json:
```json
{
  "dependencies": {
    "beeper": "2.1.0"
  }
}
```

Run `node index.js`. If I upgrade the dependency with 
`npm install beeper@latest --save` and rerun `node index.js` I see the
`ERR_REQUIRE_ESM`.

## What did `beeper` do between 2.1.0 and 3.0.0?

Looking at the [3.0.0 release](https://github.com/sindresorhus/beeper/releases/tag/v3.0.0) I see:

>This package is now pure ESM. Please read [this](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).

There is a ton of useful information in here, but I wanted to see the
beeper-specific change.

From https://github.com/sindresorhus/beeper/compare/v2.1.0...v3.0.0 I
see a few useful things:

- `module.exports =` was replaced with `export default`
- there is a new `"exports": "./index.js"` in `package.json`
- there is a new `"type": "module"` in `package.json`

## Reproduce the beeper package

The only things required to reproduce the `ERR_REQUIRE_ESM` are:

```
package/
├── index.js
└── package.json
```

where `index.js` is an empty file and `package.json` only has one
property: `"type": "module"`.

Neat! Now we know that the `ERR_REQUIRE_ESM` error is coming from the `"type": "module"` set in `package.json`.

From [the documentation](https://nodejs.org/api/packages.html#type):

>If the nearest parent package.json lacks a "type" field, or contains "type": "commonjs", .js files are treated as [CommonJS](https://nodejs.org/api/modules.html#modules-commonjs-modules). If the volume root is reached and no package.json is found, .js files are treated as CommonJS.

Oh that's interesting. NodeJS supports both CommonJS _and_ ES Modules.

## Is supporting both CJS and ES modules feasible?

Well, no; this looks pretty complex:

- https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html
- https://stackoverflow.com/a/75347455/850825
- https://antfu.me/posts/publish-esm-and-cjs

I now understand why the release notes linked to the
[Pure ESM Package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) note.

<iframe src="https://giphy.com/embed/jUwpNzg9IcyrK" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
