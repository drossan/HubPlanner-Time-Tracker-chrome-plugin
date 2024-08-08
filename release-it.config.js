module.exports = {
  git: {
	commitMessage: 'chore: release v${version}',
	tagName: 'v${version}',
	push: true,
  },
  hooks: {
	'before:init': ['node update-files.js ${version}']
  },
  npm: {
	publish: false
  }
};
