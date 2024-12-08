if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export SCRIPT_DIR=`dirname "$0"`
cd "$SCRIPT_DIR"
export SCRIPT_DIR=`pwd`/

rm -rf docs

cat > /tmp/crdt_uxp_jsdoc.json << EOF
{
  "source": {
    "include": ["./"],
    "includePattern": ".+\\\\.js?\$",
    "excludePattern": "(^|\\\\/|\\\\\\\\)(node_modules|docs|custom_minami)(\\\\/|\\\\\\\\).*\$"
  },
  "opts": {
    "destination": "./docs/",
    "recurse": true,
    "template": "custom_minami"
  }
}
EOF

npm i --save-dev minami jsdoc taffydb
jsdoc -c /tmp/crdt_uxp_jsdoc.json 

