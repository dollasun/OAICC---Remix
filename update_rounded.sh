#!/bin/bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) | xargs sed -i \
  -e 's/rounded-\[48px\]/rounded-2xl/g' \
  -e 's/rounded-\[24px\]/rounded-xl/g' \
  -e 's/shadow-slate-200\/50/shadow-slate-200\/20/g'

echo "Done"
