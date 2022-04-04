#!/bin/bash

declare -a dirs=("build" "public" "ui/build" "node_modules" "ui/node_modules" "deploy")

for i in "${dirs[@]}"
do
  if [[ -d $i ]]
  then
      echo "cleaning $i..."
      rm -rf $i
  fi
done

if [[ -f tsconfig.tsbuildinfo ]]
then
  rm tsconfig.tsbuildinfo
fi

if [[ -f deploy.zip ]]
then
  rm deploy.zip
fi