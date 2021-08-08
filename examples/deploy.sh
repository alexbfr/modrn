#!/bin/bash

DIR=`pwd`
#cd elastic-header
#npm run build-nm
#rsync -av --delete -e ssh  output/ alex@modrnjs.net:/var/www/modrnjs.net/html/examples/elastic-header/

cd $DIR
shopt -s nullglob
for ver in ../modrn.ts/dist/modrn-*.tgz; do
  versionNumber=`echo $ver | sed -e 's/^.\+-\([0-9]\+\.[0-9]\+\.[0-9]\+\).\+/\1/g'`
  echo Copying $versionNumber
  scp $ver alex@modrnjs.net:/var/www/modrnjs.net/html/dist/
  ssh alex@modrnjs.net mkdir -p /var/www/modrnjs.net/html/dist/$versionNumber
  scp ../modrn.ts/dist/* alex@modrnjs.net:/var/www/modrnjs.net/html/dist/$versionNumber
done;
ssh alex@modrnjs.net << EOF
  cd /var/www/modrnjs.net/html
  find . -type f -exec chmod 644 -- {} +
EOF
# scp ../modrn.ts/dist/modrn-*.tgz alex@modrnjs.net:/var/www/modrnjs.net/html/dist/
