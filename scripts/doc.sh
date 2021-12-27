#!/bin/bash

API="$1";

[ $# -ne 1 ] && { echo "Usage: pass API service name as argument"; exit 1;}

npx redoc-cli bundle "doc/${API}.yaml";
rm -f "doc/${API}.html" && mv redoc-static.html "doc/${API}.html";
exit 0;