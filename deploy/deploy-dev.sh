#!/bin/bash
cd ../../
tar -zcvf ./build/prerender.tar.gz prerender
scp -i ~/.ssh/dev-auto-scaling-group.pem ./build/prerender.tar.gz ubuntu@54.214.96.92:/home/ubuntu/build/prerender.tar.gz
ssh  -i ~/.ssh/dev-auto-scaling-group.pem ubuntu@54.214.96.92 << EOF
sudo -s
cd /home/ubuntu/build
rm -rf prerender
tar xvf prerender.tar.gz
rm prerender.tar.gz
cd prerender
rm -R node_modules
n 6.10.2
npm install
echo "App installed"
pm2 restart /home/ubuntu/scripts/prerender.json
echo "App started"
pm2 save
EOF