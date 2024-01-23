if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export DAEMON_ROOT_DIR=`dirname "$0"`/
cd "$DAEMON_ROOT_DIR"
export DAEMON_ROOT_DIR=`pwd`

nohup "${DAEMON_ROOT_DIR}/Mac/Tightener" -s -t n -N daemon -l 18888 >/dev/null 2>&1 &

