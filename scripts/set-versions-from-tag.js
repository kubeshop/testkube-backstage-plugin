/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function updatePackageVersion(pkgPath, version) {
  const absolutePath = path.resolve(__dirname, '..', pkgPath);
  const content = fs.readFileSync(absolutePath, 'utf8');
  const json = JSON.parse(content);

  if (json.version === version) {
    console.log(`Version for ${pkgPath} already ${version}, skipping`);
    return;
  }

  json.version = version;
  fs.writeFileSync(absolutePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
  console.log(`Updated ${pkgPath} to version ${version}`);
}

function main() {
  const tag = process.env.RELEASE_TAG;

  if (!tag) {
    console.error('RELEASE_TAG environment variable is required');
    process.exit(1);
  }

  const version = tag.replace(/^v/, '');

  if (!version) {
    console.error(`Could not derive version from tag "${tag}"`);
    process.exit(1);
  }

  updatePackageVersion('plugins/testkube/package.json', version);
  updatePackageVersion('plugins/testkube-backend/package.json', version);
}

main();
