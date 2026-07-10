#!/bin/bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) | xargs sed -i \
  -e 's/shadow-lg/shadow-sm/g' \
  -e 's/shadow-md/shadow-sm/g' \
  -e 's/shadow-brand\/30/shadow-brand\/5/g'

echo "Done"
