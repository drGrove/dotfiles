#!/bin/bash

SEARCH_DIR=$1
PW_TO_FIND=$2

CONTINUE="If you're using a yubikey with touch enabled, we recommend disabling it
while running this script. Continue? (Y/n)"

read -p "$CONTINUE" choice
echo

case "$choice" in
  y|Y|Yes) run;;
  *) exit 1;;
esac

run() {
  shopt -s globstar;
  for filename in $SEARCH_DIR/**/*.gpg; do
    decrypt=$(gpg --decrypt "$filename" 2> /dev/null)
    if [[ $decrypt == *"$PW_TO_FIND"* ]]; then
      echo -e "\e[31m$filename\e[0m"
    else
      echo -e "\e[2m$filename"
    fi
  done
}
