#!/bin/bash

emu=$1
ip=$2

if [ -z "$emu" ]; then
    echo "Input emulator name (check e2e/config/appium.capabilities.json): Example $ ./automatedTest.sh Pixel_2"
    exit
fi

if [ ! -z "$ip" ]; then
    echo "Change test ip to $ip"
    sed -i -e "s#10.0.2.2#$ip#g" app/services/backend-service.js
fi

echo "Remove the old packages from node_module."
rm -rf node_modules
tns platform remove android
tns platform add android

echo "Build the android apk file for test."
tns build android

echo "Run the automated test."
npm run e2e -- --runType $emu
