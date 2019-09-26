#!/bin/bash
#set -x

emu=$1
ip=$2
testBranch=localtest
checkExistBranch=$(git branch | grep "localtest")

# Check if branch exists
if [ ! -z "$checkExistBranch" ]; then
    git checkout $checkExistBranch
    if git fetch --all; then
        echo "Merge successfully"
    else
        exit
    fi
else
    if git checkout -b $testBranch origin/restaurant; then
        echo "Checkout new $testBranch branch successfully."
    else
        exit
    fi

fi

if [ -z "$emu" ]; then
    echo "Input emulator name (check e2e/config/appium.capabilities.json): Example $ ./automatedTest.sh Pixel_2"
    exit
fi

if [ ! -z "$ip" ]; then
    echo "Change test ip to $ip"
    sed -i -e "s#10.0.2.2#$ip#g" app/services/backend-service.js
fi

if grep -q "\"scripts\"" package.json
then
    if ! grep -q "\"e2e\"" package.json
    then
        sed -i -e '/\"scripts\":/a\
    \"e2e\": \"node ./node_modules/nativescript-dev-appium/check-dev-deps.js &&  mocha --opts ./e2e/config/mocha.opts \",' package.json
    fi
else
    sed -i -e '$i \  ,\"scripts\": {\
    \"e2e\": \"node ./node_modules/nativescript-dev-appium/check-dev-deps.js &&  mocha --opts ./e2e/config/mocha.opts "\
  }' package.json
fi

if grep -q "\"devDependencies\"" package.json
then
echo "Add the dependencies package for automated test."
sed -i -e '/\"devDependencies\":/a\
    \"appium\": \"^1.14.2\",\
    \"@types/chai\": \"^4.1.7\",\
    \"@types/mocha\": \"^5.2.7\",\
    \"@types/node\": \"^10.12.30\",\
    \"mocha\": \"^5.2.0\",\
    \"mocha-junit-reporter\": \"^1.18.0\",\
    \"mocha-multi\": \"^1.0.1\",\
    \"mochawesome\": \"^3.1.2\",\
    \"nativescript-dev-appium\": \"^6.0.0\",\
    \"nativescript-unit-test-runner\": \"^0.7.0\",\
    \"chai\": \"~4.1.2\",' package.json
fi

rm -rf node_modules
tns platform remove android
tns platform add android

tns build android
npm run e2e -- --runType $emu

