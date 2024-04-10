if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

# Use Python to parse machineInfo.json file

PYTHON_PATH=`which python`
PYTHON2_PATH=`which python2`
PYTHON3_PATH=`which python3`
if [ -f "${PYTHON3_PATH}" ]; then
    export PYTHON="${PYTHON3_PATH}"
elif [ -f "${PYTHON_PATH}" ]; then
    export PYTHON="${PYTHON_PATH}"
elif [ -f "${PYTHON2_PATH}" ]; then
    export PYTHON="${PYTHON2_PATH}"
elif [ -f "/opt/homebrew/bin/python3" ]; then
    export PYTHON="/opt/homebrew/bin/python3"
elif [ -f "/opt/homebrew/bin/python" ]; then
    export PYTHON="/opt/homebrew/bin/python"
elif [ -f "/opt/homebrew/bin/python2" ]; then
    export PYTHON="/opt/homebrew/bin/python2"
elif [ -f "/opt/homebrew/bin/python3" ]; then
    export PYTHON="/opt/homebrew/bin/python3"
elif [ -f "/usr/local/bin/python" ]; then
    export PYTHON="/usr/local/bin/python"
elif [ -f "/usr/local/bin/python2" ]; then
    export PYTHON="/usr/local/bin/python2"
elif [ -f "/usr/bin/python3" ]; then
    export PYTHON="/usr/bin/python3"
elif [ -f "/usr/bin/python" ]; then
    export PYTHON="/usr/bin/python"
elif [ -f "/usr/bin/python2" ]; then
    export PYTHON="/usr/bin/python2"
else
    echo "Cannot find a usable Python"
    exit
fi

export JSON_ATTRNAME="pluginInstallerPath"
export PYTHON_VERSION=`"${PYTHON}" --version`
if [[ "${PYTHON_VERSION}" =~ "^.* 2\..*$" ]]; then
    export PYTHONIOENCODING=utf8
    PYTHON_FILTER="import sys, json; print json.load(sys.stdin)['${JSON_ATTRNAME}'];"
else
    PYTHON_FILTER="import sys, json; print(json.load(sys.stdin)['${JSON_ATTRNAME}']);"
fi

export SYSTEM_DAEMON=~/"Library/Application Support/net.tightener/SysConfig/Tightener"

if [ ! -f "${SYSTEM_DAEMON}" ]; then
    export MACHINE_INFO=~/"Library/Application Support/net.tightener/Licensing/Machine/machineInfo.json"
    export PLUGIN_INSTALLER=`cat "$MACHINE_INFO" | "${PYTHON}" -c "${PYTHON_FILTER}"`
    if [ ! -d "${PLUGIN_INSTALLER}" ]; then
        echo "Cannot access PluginInstaller; make sure to run the PluginInstaller after moving it"
        exit
    fi

    export EMBEDDED_DAEMON="${PLUGIN_INSTALLER}/Contents/Resources/Tightener_Mac"
    if [ ! -f "${EMBEDDED_DAEMON}" ]; then
        echo "Cannot access embedded daemon; make sure to run the PluginInstaller after moving it"
        exit
    fi

    echo "\n\n\n---------\n\nInstalling daemon as ${SYSTEM_DAEMON}\n\n---------\n\n\n"
    cp "${EMBEDDED_DAEMON}" "${SYSTEM_DAEMON}"
fi

echo "\n\n\n---------\n\\nLaunching ${SYSTEM_DAEMON}\n\n---------\n\n\n"
nohup "${SYSTEM_DAEMON}" -s -t n -N daemon -l 18888 >/dev/null 2>&1 &
