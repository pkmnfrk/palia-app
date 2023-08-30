#!/bin/sh

CDNV=$(cat ./CDNV)

echo $CDNV
sls deploy --stage prd --param="cdnv=$CDNV"
