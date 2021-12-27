#!/bin/bash

API="$1";

[ $# -ne 1 ] && { echo "Usage: pass API service name as argument"; exit 1;}

npx spectral lint "doc/${API}.yaml";
