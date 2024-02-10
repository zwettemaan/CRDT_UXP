#
# De-quarantine the command line scripts.
#

if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export SCRIPT_DIR=`dirname "$0"`/
cd "$SCRIPT_DIR"
export SCRIPT_DIR=`pwd`/

xattr -d com.apple.quarantine Helpers/Mac/startDaemon.command > /dev/null 2>&1
xattr -d com.apple.quarantine Helpers/Mac/killDaemon.command > /dev/null 2>&1

echo ""
echo 'Creative Developer Tools helper command line scripts now de-quarantined.'
echo ""
echo "You can now close this Terminal window"
echo ""

