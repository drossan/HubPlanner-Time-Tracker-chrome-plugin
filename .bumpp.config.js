module.exports = {
  files: ['package.json', 'public/manifest.json', 'src/ui/components/Footer/index.ts'],
  updateConfigs: [
    {
      filename: 'public/manifest.json',
      updater: {
        readVersion: (contents) => {
          const match = contents.match(/"version":\s*"(\d+\.\d+\.\d+)"/);
          return match ? match[1] : null;
        },
        writeVersion: (contents, version) => {
          return contents.replace(/"version":\s*"\d+\.\d+\.\d+"/, `"version": "${version}"`);
        }
      }
    },
    {
      filename: 'src/ui/components/Footer/index.ts',
      updater: {
        readVersion: (contents) => {
          const match = contents.match(/v(\d+\.\d+\.\d+)/);
          return match ? match[1] : null;
        },
        writeVersion: (contents, version) => {
          return contents.replace(/v\d+\.\d+\.\d+/, `v${version}`);
        }
      }
    }
  ],
  commitMessage: 'chore: release v${version}',
  tagName: 'v${version}',
  push: true,
  tag: true
};
