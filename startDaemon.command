if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export SYSTEM_DAEMON=~/"Library/Application Support/net.tightener/SysConfig/Tightener"

if [ ! -f "${SYSTEM_DAEMON}" ]; then
    export MACHINE_INFO=~/"Library/Application Support/net.tightener/Licensing/Machine/machineInfo.json"
    export PLUGIN_INSTALLER=`sed -E "s/.*\"pluginInstallerPath\"\s*:\s*\"([^\"]*)\".*/\1/" < "$MACHINE_INFO"`
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
