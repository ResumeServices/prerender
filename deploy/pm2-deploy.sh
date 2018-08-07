#!/bin/bash

set -e

sudo chown -R ubuntu:ubuntu /home/ubuntu

cd /home/ubuntu/prerender

npm install
echo "App installed"


while [ ! -f /home/ubuntu/prerender-pm2-config.json ]
do
  sleep 2
done


sudo pm2 reload /home/ubuntu/prerender-pm2-config.json --update-env
echo "App started"
sudo pm2 save


