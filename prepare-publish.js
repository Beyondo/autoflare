const fs = require('fs-extra');

async function prepareForPublish() {
  // Clear previous build
  await fs.emptyDir('./publish');

  // Copy from dist to publish directory
  await fs.copy('./dist', './publish');

  // Adjust package.json
  const packageJson = await fs.readJson('./package.json');
  delete packageJson.scripts.prepare;
  await fs.writeJson('./publish/package.json', packageJson, { spaces: 2 });

  // Copy any other necessary files to ./publish (README, LICENSE, etc.)
}

prepareForPublish().catch(err => console.error(err));