const anonymfile = require('./index.js');

(async() => {
	const LINK = await anonymfile({
		directory: ['./package-lock.json', './package.json', './.gitignore'],
		compress: {
			active: true,
			name: 'Archive',
			type: 'zip' // 'zip' or 'tar'
		}
	});

	console.log(LINK);
})();