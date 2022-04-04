#!/bin/bash

workspacedir=$(pwd)
yarn
mkdir -p public
yarn build
cd ui
yarn
yarn build
if [[ "$OSTYPE" == "darwin"* ]]; then
  cp -r build/ ../public/
else
  cp -r build/* ../public
fi
