if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export scriptDir=`dirname "$0"`
cd "$scriptDir"
export scriptDir=`pwd`/

open ./Helpers/Mac/LicenseManager.app

echo ""
echo "---------------"
echo ""
echo "LicenseManager has been started"
echo ""
echo "You can now close this Terminal window"
echo ""
echo "---------------"
echo ""