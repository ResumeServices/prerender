#!/bin/bash

sudo chown -R ubuntu:ubuntu /home/ubuntu

cd /home/ubuntu/prerender

sudo n 6.10.2
npm install
echo "App installed"


cat <<EOF > /home/ubuntu/prerender-pm2-config.json
{
  "apps":
  [
    {
      "name": "prerender",
      "cwd":"/home/ubuntu/prerender",
      "script": "server.js",
      "env": {
        "PORT":"6000",
        "NODE_ENV":"prod",
        "ROOT_URL":"http://localhost:6000",
        "IGNORE_QUERY_PARAMS":"utm_content,utm_term,utm_source,email_hash,utm_campaign,utm_medium,passwordinput,userid,code,src,imt,_ke,_escaped_fragment_",
        "S3_BUCKET_NAME":"resume-prerender-cache",
        "ALLOWED_DOMAINS":"www.resume.com,employer.resume.com",
        "JS_TIMEOUT":15000,
        "MONGO_URL":"mongodb://prerender:n7ejAwRhkWhR@candidate.40.mongolayer.com:10700,candidate.41.mongolayer.com:10849/prerender?replicaSet=set-55b2caa535fae993ff0009a6"
      }
    }
  ]
}
EOF


sudo pm2 restart /home/ubuntu/prerender-pm2-config.json
echo "App started"
sudo pm2 save


