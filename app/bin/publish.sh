#!/bin/sh
# mv build/ coupon/
# scp -P 40022 -r coupon h5yww@120.55.113.150:/alidata/h5/put
# ssh -p 40022 h5yww@120.55.113.150 'cd /alidata/h5/put && chmod -R 777 coupon'
# mv coupon/ build/

cd ../share-platform-build/
svn update
svn delete *
cp -R ../share-platform/build/ .
svn add *
svn commit -m ""