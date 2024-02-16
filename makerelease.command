export EXTENSION_DIR_NAME=CreativeDeveloperTools_UXP

echo "makerelease ${EXTENSION_DIR_NAME} (UXPTightener) started"

if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export SCRIPT_DIR=`dirname "$0"`
cd "$SCRIPT_DIR"
export SCRIPT_DIR=`pwd`/

#
# Assume nvm, npm and node are installed
# Node must be version 20 - version 21 has problems with deprecated 'punycode'
#
npm install jsdoc-to-markdown
# https://github.com/jsdoc2md/jsdoc-to-markdown/issues/279
./node_modules/.bin/jsdoc2md "!(node_modules|coverage)/**/*.js" > docs.md

if [ "${TIGHTENER_RELEASE_ROOT}" = "" -o ! -d "${TIGHTENER_RELEASE_ROOT}" ]; then
    echo "Cannot make release. JSXGetURL repo needs to be installed alongside TightenerDocs repo"
    exit
fi

. "${TIGHTENER_GIT_ROOT}BuildScripts/setEnv"

export CREATIVEDEVTOOLS_UXP_VERSION=`head -n 1 "Version.txt" | tr -d '\r'`

sed -E "s/\"version\":\s*\"[^\"]*\"/\"version\": \"${CREATIVEDEVTOOLS_UXP_VERSION}\"/" "${SCRIPT_DIR}${EXTENSION_DIR_NAME}/manifest.json" > "${SCRIPT_DIR}${EXTENSION_DIR_NAME}/manifest.json.new"

mv "${SCRIPT_DIR}${EXTENSION_DIR_NAME}/manifest.json.new" "${SCRIPT_DIR}${EXTENSION_DIR_NAME}/manifest.json"

export RELEASE_DIR_NAME=${EXTENSION_DIR_NAME}.${CREATIVEDEVTOOLS_UXP_VERSION}
export RELEASE_DIR="${SCRIPT_DIR}${RELEASE_DIR_NAME}/"
rm -rf ${RELEASE_DIR_NAME}.zip

rm -rf "${RELEASE_DIR}"

mkdir "${RELEASE_DIR}"
mkdir "${RELEASE_DIR}Helpers"
mkdir "${RELEASE_DIR}Helpers/Mac"
mkdir "${RELEASE_DIR}Helpers/Windows_x86_64"
mkdir "${RELEASE_DIR}Helpers/Windows_arm64"

if [ -f creative-developer-tools-uxp-sample_ID.ccx ]; then
    cp creative-developer-tools-uxp-sample_ID.ccx "${RELEASE_DIR}"
fi

if [ -f creative-developer-tools-uxp-sample_PS.ccx ]; then
    cp creative-developer-tools-uxp-sample_PS.ccx "${RELEASE_DIR}"
fi

# Fetch latest License Manager

cp "${TIGHTENER_RELEASE_ROOT}Apps/LicenseManager.tgz" "${RELEASE_DIR}Helpers"

cd "${RELEASE_DIR}Helpers"

tar -zxf LicenseManager.tgz > /dev/null
rm -f LicenseManager.tgz

cd LicenseManager

unzip MacOS_Intel_And_M1/LicenseManager.zip > /dev/null
mv    LicenseManager.app     "${RELEASE_DIR}Helpers/Mac"
mv    README.md              "${RELEASE_DIR}Helpers/Mac/LicenseManager_README.md"

unzip Windows_Intel_x86_64/LicenseManager.zip > /dev/null
mv    LicenseManager         "${RELEASE_DIR}Helpers/Windows_x86_64"
mv    README.md              "${RELEASE_DIR}Helpers/Windows_x86_64/LicenseManager_README.md"

unzip Windows_ARM64/LicenseManager.zip > /dev/null
mv    LicenseManager         "${RELEASE_DIR}Helpers/Windows_arm64"
mv    README.md              "${RELEASE_DIR}Helpers/Windows_arm64/LicenseManager_README.md"

cd ..

rm -rf LicenseManager

cd "${SCRIPT_DIR}"

cp startDaemon.command "${RELEASE_DIR}Helpers/Mac"
cp killDaemon.command "${RELEASE_DIR}Helpers/Mac"

cp startDaemon.bat "${RELEASE_DIR}Helpers/Windows_x86_64"
cp killDaemon.bat "${RELEASE_DIR}Helpers/Windows_x86_64"

cp startDaemon.bat "${RELEASE_DIR}Helpers/Windows_arm64"
cp killDaemon.bat "${RELEASE_DIR}Helpers/Windows_arm64"

cp macDequarantineHelpers.command "${RELEASE_DIR}"

cp -R ${EXTENSION_DIR_NAME} "${RELEASE_DIR}"
cp README.md                "${RELEASE_DIR}"
cp docs.md                  "${RELEASE_DIR}"

find . -name ".DS_Store" | while read a; do rm "$a"; done

zip -y -r ${RELEASE_DIR_NAME}.zip ${RELEASE_DIR_NAME} > /dev/null

rm -rf ${RELEASE_DIR_NAME}

echo "makerelease ${EXTENSION_DIR_NAME} (UXPTightener) done"
