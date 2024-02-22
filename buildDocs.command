if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export SCRIPT_DIR=`dirname "$0"`
cd "$SCRIPT_DIR"
export SCRIPT_DIR=`pwd`/

rm docs.md

./node_modules/.bin/jsdoc2md "!(node_modules|coverage)/**/*.js" > docs.md

