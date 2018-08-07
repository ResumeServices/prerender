#!/bin/bash

set -e

sudo chown -R ubuntu:ubuntu /home/ubuntu

cd /tmp


wget https://aws-codedeploy-us-west-2.s3.amazonaws.com/latest/install
sudo chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent start

sudo npm install -g n


