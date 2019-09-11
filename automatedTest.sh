#!/bin/bash
#set -x

echo "Remove the old packages from node_module."
rm -rf node_modules
tns platform remove android
tns platform add android

echo "Build the android apk file for test."
tns build android

echo "Run the automated test."
npm run e2e -- --runType $emu
