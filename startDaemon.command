if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export LICENSE_MANAGER_ROOT=`dirname "$0"`/
cd "$LICENSE_MANAGER_ROOT"
export LICENSE_MANAGER_ROOT=`pwd`/

export EMBEDDED_DAEMON="${LICENSE_MANAGER_ROOT}/Mac/LicenseManager.app/Contents/Resources/Tightener_Mac"
export SYSTEM_DAEMON=~/"Library/Application Support/net.tightener/SysConfig/Tightener"
if [ ! -f "${SYSTEM_DAEMON}" ]; then
    if [ ! -f "${EMBEDDED_DAEMON}"; ] then
        echo "Cannot access License Manager; make sure this script is not moved from being alongside the 'License Manager' folder"
        exit
    fi
    echo "Installing daemon as $SYSTEM_DAEMON"
    cp "${EMBEDDED_DAEMON}" "${SYSTEM_DAEMON}"
fi

nohup "${SYSTEM_DAEMON}" -s -t n -N daemon -l 18888 >/dev/null 2>&1 &
