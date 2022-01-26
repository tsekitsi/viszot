#!/bin/bash

# Prereqs: expects 1 argument - path to parent of dir "chrome" (dir you want to monitor for git changes).
#          Note: assumes that "install.rdf" is in the parent of dir "chrome".
# Description: It increments the addon version number if there have been changes in the monitored dir.

cd $1

# Get the current version (CUR_VER) as well as the old* version - *before any changes:
get_version () {
    CUR_VER=$(xmllint --xpath "string(//*[local-name()='version'])" install.rdf)
    OLD_VER=$(git show HEAD:./install.rdf | xmllint --xpath "string(//*[local-name()='version'])" -)
    IFS='.' read -r -a CUR_VER_AS_ARR <<< "$CUR_VER"  # https://stackoverflow.com/a/10586169
    IFS='.' read -r -a OLD_VER_AS_ARR <<< "$OLD_VER"
}

# Increment CUR_VER by one minor unit, keeping minor & midium units under 10:
increment_version () {
    NEW_MINOR=$(expr ${CUR_VER_AS_ARR[2]} + 1)
    if [[ NEW_MINOR -eq $(expr $NEW_MINOR % 10) ]]; then
        NEW_VER=${CUR_VER_AS_ARR[0]}.${CUR_VER_AS_ARR[1]}.$NEW_MINOR
    else
        NEW_MIDIM=$(expr ${CUR_VER_AS_ARR[1]} + 1)
        if [[ NEW_MIDIM -eq $(expr $NEW_MIDIM % 10) ]]; then
            NEW_VER=${CUR_VER_AS_ARR[0]}.$NEW_MIDIM.0
        else
            NEW_MAJOR=$(expr ${CUR_VER_AS_ARR[0]} + 1)
            NEW_VER=$NEW_MAJOR.0.0
        fi
    fi
}

# Replace the version in the file "install.rdf":
set_version () {
    FN=install.rdf
    sed -i "" "s/<em:version>.*<\/em:version>/<em:version>$NEW_VER<\/em:version>/g" $FN
}  # https://askubuntu.com/a/444105

# If there have been changes, increment version (but not excessively!):
if [[ -n $(git status -s chrome) ]]; then  # https://stackoverflow.com/a/9393642
    get_version
    if [[ ${CUR_VER_AS_ARR[2]} -le ${OLD_VER_AS_ARR[2]} ]]; then  # if new version is <= +1
        increment_version
        set_version
    fi
fi
