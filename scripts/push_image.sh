#!/bin/sh

HOST=285209584037.dkr.ecr.us-east-1.amazonaws.com
REPO=$HOST/palia-app-repo
CDNV=$(git rev-parse --short HEAD)

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $HOST

echo $CDNV > CDNV
docker build -t $REPO:$CDNV -t $REPO:latest .

docker push $REPO:$CDNV
docker push $REPO:latest
