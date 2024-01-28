const fs = require('fs-extra');

async function prepareForPublish() {
  const packageJson = await fs.readJson('./package.json');
  delete packageJson.scripts.prepub;
  delete packageJson.scripts.publish;
  await fs.writeJson('./dist/package.json', packageJson, { spaces: 2 });
  await fs.copy('./LICENSE', './dist/LICENSE');
  await fs.copy('./README.md', './dist/README.md');
}

prepareForPublish().catch(err => console.error(err));