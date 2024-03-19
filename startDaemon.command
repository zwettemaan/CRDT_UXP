if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export PLUGIN_INSTALLER_ROOT=`dirname "$0"`/
cd "$PLUGIN_INSTALLER_ROOT"
export PLUGIN_INSTALLER_ROOT=`pwd`/

export EMBEDDED_DAEMON="${PLUGIN_INSTALLER_ROOT}/PluginInstaller.app/Contents/Resources/Tightener_Mac"
export SYSTEM_DAEMON=~/"Library/Application Support/net.tightener/SysConfig/Tightener"
if [ ! -f "${SYSTEM_DAEMON}" ]; then
    if [ ! -f "${EMBEDDED_DAEMON}" ]; then
        echo "Cannot access PluginInstaller; make sure this script is not moved from being alongside the 'PluginInstaller' folder"
        exit
    fi
    echo "\n\n\n---------\n\nInstalling daemon as ${SYSTEM_DAEMON}\n\n---------\n\n\n"
    cp "${EMBEDDED_DAEMON}" "${SYSTEM_DAEMON}"
fi

echo "\n\n\n---------\n\\nLaunching ${SYSTEM_DAEMON}\n\n---------\n\n\n"
nohup "${SYSTEM_DAEMON}" -s -t n -N daemon -l 18888 >/dev/null 2>&1 &
