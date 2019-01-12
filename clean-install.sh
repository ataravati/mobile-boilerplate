#!/bin/bash

echo "----[ removing yarn packages"
rm -rf ./node_modules
rc=$?
if [ $rc != 0 ] ; then
    echo "====[ Error: Failed to remove yarn packages"
    exit $rc
fi

echo "----[ installing yarn packages"
yarn install
rc=$?
if [ $rc != 0 ] ; then
    echo "====[ Error: Failed to yarn install"
    exit $rc
fi

echo "----[ clean install complete"