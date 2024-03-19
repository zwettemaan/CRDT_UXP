if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

. "${TIGHTENER_GIT_ROOT}BuildScripts/setEnv"

echo "makerelease ${CRDT_UXP_PRODUCT_NAME} in ${CRDT_UXP_GIT_ROOT} started"

if [ "${TIGHTENER_RELEASE_ROOT}" = "" -o ! -d "${TIGHTENER_RELEASE_ROOT}" ]; then
    echo "Cannot make release. CRDT_UXP repo needs to be installed alongside TightenerDocs repo"
    exit
fi

export SCRIPT_DIR=`dirname "$0"`
cd "$SCRIPT_DIR"
export SCRIPT_DIR=`pwd`/

./buildDocs.command

sed -E "s/\"version\":\s*\"[^\"]*\"/\"version\": \"${CREATIVEDEVTOOLS_UXP_VERSION}\"/" "${SCRIPT_DIR}${CRDT_UXP_PRODUCT_NAME}/manifest.json" > "${SCRIPT_DIR}${CRDT_UXP_PRODUCT_NAME}/manifest.json.new"

mv "${SCRIPT_DIR}${CRDT_UXP_PRODUCT_NAME}/manifest.json.new" "${SCRIPT_DIR}${CRDT_UXP_PRODUCT_NAME}/manifest.json"

rm -rf ${CRDT_UXP_RELEASE}

rm -rf "${CRDT_UXP_RELEASE_DIR_TEMP}"

mkdir "${CRDT_UXP_RELEASE_DIR_TEMP}"
mkdir "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers"
mkdir "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Mac"
mkdir "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_x86_64"
mkdir "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_arm64"

if [ -f creative-developer-tools-uxp-sample_ID.ccx ]; then
    cp creative-developer-tools-uxp-sample_ID.ccx "${CRDT_UXP_RELEASE_DIR_TEMP}"
fi

if [ -f creative-developer-tools-uxp-sample_PS.ccx ]; then
    cp creative-developer-tools-uxp-sample_PS.ccx "${CRDT_UXP_RELEASE_DIR_TEMP}"
fi

# Fetch latest PluginInstaller

cp "${TIGHTENER_RELEASE_ROOT}Apps/PluginInstaller.tgz" "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers"

cd "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers"

tar -zxf PluginInstaller.tgz > /dev/null
rm -f PluginInstaller.tgz

cd PluginInstaller

unzip MacOS_Intel_And_M1/PluginInstaller.zip > /dev/null
mv    PluginInstaller.app          "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Mac"
mv    README.md                    "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Mac/PluginInstaller_README.md"

unzip Windows_Intel_x86_64/PluginInstaller.zip > /dev/null
mv    PluginInstaller              "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_x86_64"
mv    README.md                    "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_x86_64/PluginInstaller_README.md"

unzip Windows_ARM64/PluginInstaller.zip > /dev/null
mv    PluginInstaller              "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_arm64"
mv    README.md                    "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_arm64/PluginInstaller_README.md"

cd ..

rm -rf PluginInstaller

cd "${SCRIPT_DIR}"

cp startDaemon.command             "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Mac"
cp killDaemon.command              "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Mac"

cp startDaemon.bat                 "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_x86_64"
cp killDaemon.bat                  "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_x86_64"

cp startDaemon.bat                 "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_arm64"
cp killDaemon.bat                  "${CRDT_UXP_RELEASE_DIR_TEMP}Helpers/Windows_arm64"

cp macDequarantineHelpers.command  "${CRDT_UXP_RELEASE_DIR_TEMP}"

cp -R ${CRDT_UXP_PRODUCT_NAME}     "${CRDT_UXP_RELEASE_DIR_TEMP}"
cp README.md                       "${CRDT_UXP_RELEASE_DIR_TEMP}"
cp docs.md                         "${CRDT_UXP_RELEASE_DIR_TEMP}"

find . -name ".DS_Store" | while read a; do rm "$a"; done

zip -y -r ${CRDT_UXP_RELEASE_DIR_NAME}.zip ${CRDT_UXP_RELEASE_DIR_NAME} > /dev/null

rm -rf ${CRDT_UXP_RELEASE_DIR_TEMP}

echo "makerelease ${CRDT_UXP_PRODUCT_NAME} done"
