#!/bin/bash

set -e

sudo chown -R ubuntu:ubuntu /home/ubuntu

cd /home/ubuntu/prerender

npm install
echo "App installed"


sudo pm2 restart /home/ubuntu/prerender-pm2-config.json --update-env
echo "App started"
sudo pm2 save


