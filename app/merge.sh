#!/usr/bin/env bash
cp -r staging/static/css/* dist/static/css/ 
cp -r staging/static/js/* dist/static/js/
rm -rf staging/static/
cp -r staging/* dist/
rm -rf staging/