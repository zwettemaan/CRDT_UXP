export EXTENSION_DIR_NAME=CreativeDeveloperTools_UXP

echo "makerelease ${EXTENSION_DIR_NAME} (UXPTightener) started"

if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export SCRIPT_DIR=`dirname "$0"`
cd "$SCRIPT_DIR"
export SCRIPT_DIR=`pwd`/

./buildDocs.command

if [ "${TIGHTENER_RELEASE_ROOT}" = "" -o ! -d "${TIGHTENER_RELEASE_ROOT}" ]; then
    echo "Cannot make release. UXPTightener repo needs to be installed alongside TightenerDocs repo"
    exit
fi

. "${TIGHTENER_GIT_ROOT}BuildScripts/setEnv"

sed -E "s/\"version\":\s*\"[^\"]*\"/\"version\": \"${CREATIVEDEVTOOLS_UXP_VERSION}\"/" "${SCRIPT_DIR}${EXTENSION_DIR_NAME}/manifest.json" > "${SCRIPT_DIR}${EXTENSION_DIR_NAME}/manifest.json.new"

mv "${SCRIPT_DIR}${EXTENSION_DIR_NAME}/manifest.json.new" "${SCRIPT_DIR}${EXTENSION_DIR_NAME}/manifest.json"

export CRDT_UXP_RELEASE_DIR_NAME=${EXTENSION_DIR_NAME}.${CREATIVEDEVTOOLS_UXP_VERSION}
export CRDT_UXP_RELEASE_DIR="${SCRIPT_DIR}${CRDT_UXP_RELEASE_DIR_NAME}/"
rm -rf ${CRDT_UXP_RELEASE_DIR_NAME}.zip

rm -rf "${CRDT_UXP_RELEASE_DIR}"

mkdir "${CRDT_UXP_RELEASE_DIR}"
mkdir "${CRDT_UXP_RELEASE_DIR}Helpers"
mkdir "${CRDT_UXP_RELEASE_DIR}Helpers/Mac"
mkdir "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_x86_64"
mkdir "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_arm64"

if [ -f creative-developer-tools-uxp-sample_ID.ccx ]; then
    cp creative-developer-tools-uxp-sample_ID.ccx "${CRDT_UXP_RELEASE_DIR}"
fi

if [ -f creative-developer-tools-uxp-sample_PS.ccx ]; then
    cp creative-developer-tools-uxp-sample_PS.ccx "${CRDT_UXP_RELEASE_DIR}"
fi

# Fetch latest License Manager

cp "${TIGHTENER_RELEASE_ROOT}Apps/LicenseManager.tgz" "${CRDT_UXP_RELEASE_DIR}Helpers"

cd "${CRDT_UXP_RELEASE_DIR}Helpers"

tar -zxf LicenseManager.tgz > /dev/null
rm -f LicenseManager.tgz

cd LicenseManager

unzip MacOS_Intel_And_M1/LicenseManager.zip > /dev/null
mv    LicenseManager.app     "${CRDT_UXP_RELEASE_DIR}Helpers/Mac"
mv    README.md              "${CRDT_UXP_RELEASE_DIR}Helpers/Mac/LicenseManager_README.md"

unzip Windows_Intel_x86_64/LicenseManager.zip > /dev/null
mv    LicenseManager         "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_x86_64"
mv    README.md              "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_x86_64/LicenseManager_README.md"

unzip Windows_ARM64/LicenseManager.zip > /dev/null
mv    LicenseManager         "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_arm64"
mv    README.md              "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_arm64/LicenseManager_README.md"

cd ..

rm -rf LicenseManager

cd "${SCRIPT_DIR}"

cp startDaemon.command "${CRDT_UXP_RELEASE_DIR}Helpers/Mac"
cp killDaemon.command "${CRDT_UXP_RELEASE_DIR}Helpers/Mac"

cp startDaemon.bat "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_x86_64"
cp killDaemon.bat "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_x86_64"

cp startDaemon.bat "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_arm64"
cp killDaemon.bat "${CRDT_UXP_RELEASE_DIR}Helpers/Windows_arm64"

cp macDequarantineHelpers.command "${CRDT_UXP_RELEASE_DIR}"

cp -R ${EXTENSION_DIR_NAME} "${CRDT_UXP_RELEASE_DIR}"
cp README.md                "${CRDT_UXP_RELEASE_DIR}"
cp docs.md                  "${CRDT_UXP_RELEASE_DIR}"

find . -name ".DS_Store" | while read a; do rm "$a"; done

zip -y -r ${CRDT_UXP_RELEASE_DIR_NAME}.zip ${CRDT_UXP_RELEASE_DIR_NAME} > /dev/null

rm -rf ${CRDT_UXP_RELEASE_DIR_NAME}

echo "makerelease ${EXTENSION_DIR_NAME} (UXPTightener) done"
