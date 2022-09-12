"use strict";

const fs = require('node:fs')
const path = require('path');
const upload = require('./src/upload.js');
const multiple_uploads = require('./src/multiple_uploads.js');
const compress_files = require('./src/compress_files.js');

//you must send the directory of the file to the "AnonymousFiles" function
const AnonymousFiles = async({directory, compress={active: false, name: 'Archive', type: 'tar'}, progress}) => {
	const dir_tmp = path.join(__dirname, '.tmp');
	if(!fs.existsSync(dir_tmp))fs.mkdirSync(dir_tmp);
	
	if(directory === undefined) return {Error: 'You must pass the directory of the file'}

	if(compress.active === undefined) compress.active = false;
	if(compress.name === undefined) compress.name = 'Archive';
	if(compress.type === undefined) compress.type = 'tar';
	
	directory = await compress_files({directory, compress});
	if(directory.Error !== undefined) return directory;

	if(!Array.isArray(directory)) {
		try {
			const data = await upload(directory, compress, progress);
			return data;
		}catch(err) {
			return err;
		}
	}
	else return await multiple_uploads(directory, compress, progress);

}

module.exports = AnonymousFiles;