#!/bin/bash

set -e

sudo chown -R ubuntu:ubuntu /home/ubuntu

cd /tmp


wget https://aws-codedeploy-us-west-2.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
service codedeploy-agent start

npm install -g n


