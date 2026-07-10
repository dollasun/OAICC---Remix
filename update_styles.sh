#!/bin/bash
find src -type f \( -name "*.tsx" -o -name "*.ts" \) | xargs sed -i \
  -e 's/rounded-\[40px\]/tmp-r-2xl/g' \
  -e 's/rounded-\[32px\]/tmp-r-2xl/g' \
  -e 's/rounded-\[20px\]/tmp-r-xl/g' \
  -e 's/rounded-t-\[32px\]/rounded-t-2xl/g' \
  -e 's/rounded-t-\[40px\]/rounded-t-2xl/g' \
  -e 's/rounded-3xl/tmp-r-2xl/g' \
  -e 's/rounded-2xl/tmp-r-xl/g' \
  -e 's/rounded-xl/tmp-r-lg/g' \
  -e 's/tmp-r-2xl/rounded-2xl/g' \
  -e 's/tmp-r-xl/rounded-xl/g' \
  -e 's/tmp-r-lg/rounded-lg/g' \
  -e 's/shadow-2xl/tmp-s-lg/g' \
  -e 's/shadow-xl/tmp-s-md/g' \
  -e 's/shadow-lg/tmp-s-sm/g' \
  -e 's/tmp-s-lg/shadow-lg/g' \
  -e 's/tmp-s-md/shadow-md/g' \
  -e 's/tmp-s-sm/shadow-sm/g' \
  -e 's/shadow-brand\/20/shadow-brand\/5/g' \
  -e 's/shadow-brand\/10/shadow-brand\/5/g'

echo "Done"
