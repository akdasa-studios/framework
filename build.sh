#!/bin/sh
rm -rf dist.cjs
rm -rf dist.esm

npx tsc --module commonjs --outdir dist.cjs
npx tsc --module es6 --outdir dist.esm

npx resolve-tspaths -o ./dist.cjs
npx resolve-tspaths -o ./dist.esm
