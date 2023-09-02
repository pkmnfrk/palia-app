#!/bin/sh

cd api
npm version $1
cd ../web
npm version $1
cd ..
git commit -m v$1
git tag v$1
