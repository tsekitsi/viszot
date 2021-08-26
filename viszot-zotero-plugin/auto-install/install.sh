#!/bin/bash
# https://stackoverflow.com/a/26759734:
if ! [ -x "$(command -v pip3)" ]; then
  echo 'Error: pip3 is not installed.' >&2
  exit 1
fi
pip3 install --user lz4
python3 install.py
