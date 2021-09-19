#!/bin/bash

# It works on MacOS 🤷‍♂️

cd python_installer

# If Zotero is running, kill it.
ZOTERO_PID=`pgrep -f zotero`  # https://askubuntu.com/a/870231
if [ -z $ZOTERO_PID ]
then
    :
else
    ZOTERO_PATH=$(which `ps -o comm= -p $ZOTERO_PID`)  # https://stackoverflow.com/a/14805977
    kill -9 $ZOTERO_PID
fi

MODE=$1
PYTHON_VERSION=`python -c "import platform;import sys;sys.stdout.write(platform.python_version_tuple()[0])"`
if [ $PYTHON_VERSION -lt 3 ]
then  # if your default python version is < 3
    PY_STR="python3"
else  # else (if your default python version is >= 3)
    PY_STR="python"
fi

# Make new xpi (from current source code):
$PY_STR -c "from helpers import make_xpi; make_xpi('../src', '..')"

# Handle arguments (aka install/reinstall/uninstall):
case $MODE in
    -u) $PY_STR uninstall_viszot.py ;;
    -r) $PY_STR uninstall_viszot.py; $PY_STR install_viszot.py ;;
    *) $PY_STR install_viszot.py ;;  # unknown option
esac

# If Zotero was running, open it again.
if [ -z $ZOTERO_PID ]
then
    :
else
    $ZOTERO_PATH &> /dev/null & disown  # https://stackoverflow.com/a/18063720
fi

cd ..
