echo "makerelease CreativeDeveloperTools_UXP (UXPTightener) started"

if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export scriptDir=`dirname "$0"`
cd "$scriptDir"
export scriptDir=`pwd`/

if [ "${TIGHTENER_RELEASE_ROOT}" = "" -o ! -d "${TIGHTENER_RELEASE_ROOT}" ]; then
    echo "Cannot make release. JSXGetURL repo needs to be installed alongside TightenerDocs repo"
    exit
fi

. "${TIGHTENER_GIT_ROOT}BuildScripts/setEnv"

export CREATIVEDEVTOOLS_UXP_VERSION=`head -n 1 "Version.txt"`

export RELEASE_DIR_NAME=CreativeDeveloperTools_UXP.${CREATIVEDEVTOOLS_UXP_VERSION}
export RELEASE_DIR="${scriptDir}${RELEASE_DIR_NAME}/"
rm -rf ${RELEASE_DIR_NAME}.zip

rm -rf "${RELEASE_DIR}"

mkdir "${RELEASE_DIR}"
mkdir "${RELEASE_DIR}LicenseManager"
mkdir "${RELEASE_DIR}LicenseManager/Mac"
mkdir "${RELEASE_DIR}LicenseManager/Windows"
mkdir "${RELEASE_DIR}LicenseManager/Windows/ARM64"

# Fetch latest License Manager

cp "${TIGHTENER_RELEASE_ROOT}Apps/LicenseManager.tgz" "${RELEASE_DIR}LicenseManager"

cd "${RELEASE_DIR}LicenseManager"
tar -zxf LicenseManager.tgz > /dev/null
rm -f LicenseManager.tgz

cd LicenseManager

unzip MacOS_Intel_And_M1/LicenseManager.zip > /dev/null
mv    LicenseManager.app "${RELEASE_DIR}LicenseManager/Mac"
mv    README.txt         "${RELEASE_DIR}LicenseManager/Mac"

unzip Windows_Intel_x86_64/LicenseManager.zip > /dev/null
mv    LicenseManager     "${RELEASE_DIR}LicenseManager/Windows"
mv    README.txt         "${RELEASE_DIR}LicenseManager/Windows"

unzip Windows_ARM64/LicenseManager.zip > /dev/null
mv    LicenseManager     "${RELEASE_DIR}LicenseManager/Windows/ARM64"
mv    README.txt         "${RELEASE_DIR}LicenseManager/Windows/ARM64"

cd ..

rm -rf LicenseManager

cd "${scriptDir}"

cp -R CreativeDeveloperTools_UXP           "${RELEASE_DIR}"
cp README.md                               "${RELEASE_DIR}"

find . -name ".DS_Store" | while read a; do rm "$a"; done

zip -r ${RELEASE_DIR_NAME}.zip ${RELEASE_DIR_NAME} > /dev/null

rm -rf ${RELEASE_DIR_NAME}

echo "makerelease CreativeDeveloperTools_UXP (UXPTightener) done"
