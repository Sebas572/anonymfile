const upload = require('./upload.js');
const compressFiles = require('./compress_files.js');

const multiple_uploads = (directory, compress, progress) => {
	const Json = [];

	return new Promise((resolve, reject) => {
		directory.forEach(async(element, index) => {
			try {
				const get = await upload(element, compress, progress);
				Json.push(get);
			
			}catch (err) {
				Json.push(err);
			}
			
			if(Json.length === directory.length) resolve(Json);
		});

	});
}

module.exports = multiple_uploads;