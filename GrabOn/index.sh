#!/bin.sh 
npm install --unsafe-perm=true --allow-root
node category.js
node url.js
killall chrome
python3 converter.py