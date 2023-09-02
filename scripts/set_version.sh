#!/bin/sh

cd api
npm version $1
git add package*.json
cd ../web
npm version $1
git add package*.json
cd ..
echo VERSION=$1 > VERSION
git add VERSION
git commit -m v$1
git tag v$1
