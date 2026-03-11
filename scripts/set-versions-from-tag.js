/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const semver = require('semver');

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

  if (!semver.valid(version)) {
    console.error(`Invalid version derived from tag "${tag}": "${version}" is not a valid semver`);
    console.error('Expected tag format: v1.2.3 or 1.2.3');
    process.exit(1);
  }

  updatePackageVersion('plugins/testkube/package.json', version);
  updatePackageVersion('plugins/testkube-backend/package.json', version);
}

main();
