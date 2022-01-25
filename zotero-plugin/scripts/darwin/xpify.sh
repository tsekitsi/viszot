#!/bin/bash

# Prereqs: expects 1 argument - path to dir whose contents to zip.
# Description: (over)writes xpi on the same level as the dir being zipped.

cd $1  # get into the directory to zip

rm -f ../*.xpi  # remove old xpi file, ignore if missing

# Extract plugin name and version:
NAME=$(xmllint --xpath "string(//*[local-name()='name'])" install.rdf)
VER=$(xmllint --xpath "string(//*[local-name()='version'])" install.rdf)

# Perform zip:
zip -r -X ../$NAME-$VER.xpi *  # ignore invisible Mac resource files (https://wpbeaches.com/how-to-compress-and-uncompress-files-and-folders-in-the-terminal-in-macos-big-sur/)
