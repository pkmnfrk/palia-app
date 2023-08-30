#!/bin/sh

REPO=285209584037.dkr.ecr.us-east-1.amazonaws.com/palia-app-repo
CDNV=(git rev-parse --short HEAD)
echo CDNV > CDNV
docker build -t $REPO:$CDNV -t $REPO:latest .

