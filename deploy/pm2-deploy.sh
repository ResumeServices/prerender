#!/bin/bash

sudo chown -R ubuntu:ubuntu /home/ubuntu

cd /home/ubuntu/prerender

sudo n 6.10.2
npm install
echo "App installed"


sudo pm2 restart /home/ubuntu/prerender-pm2-config.json
echo "App started"
sudo pm2 save


