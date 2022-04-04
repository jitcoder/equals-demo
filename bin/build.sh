#!/bin/bash

workspacedir=$(pwd)
yarn
yarn workspace @equals-demo/engine build
yarn workspace @equals-demo/server build