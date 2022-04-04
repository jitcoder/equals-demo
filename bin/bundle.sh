#!/bin/bash

./bin/clean.sh
./bin/build.sh

mkdir -p deploy/build/
mkdir -p deploy/public/

echo "copying..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  cp -r build/ deploy/build/
  cp -r public/ deploy/public/
else
  cp -r build/ deploy/
  cp -r public/ deploy/
fi
cp package.json deploy/package.json

echo "creating bundle..."
cd deploy
zip -r deploy.zip .
mv deploy.zip ../deploy.zip
cd ..
rm -rf deploy
unzip -l deploy.zip
