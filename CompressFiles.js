"use strict";

const fs = require('node:fs');
const tar = require('tar');
const archiver = require('archiver');
const path = require('path');

const formats = {
	zip: 'zip',
	tar: 'tar.gz'
}

const CompressFiles = ({directory, compress}) => {
	let complete;

	let FindError;
	directory.forEach((dir) => {
		if(!fs.existsSync(dir)) {
			FindError = {Error: 'This file does not exist'};
		}
	})

	if(FindError !== undefined) return FindError;

	const type = formats[compress.type];
	const fileName = path.join(__dirname, '.tmp', `${compress.name}.${type}`);
	const output = fs.createWriteStream(fileName);
	const archive = archiver(compress.type, {zlib: { level: 9 }});

	output.on('end', () => { console.error('Data has been drained'); })

	archive.on('warning', (err) => {
		if (err.code === 'ENOENT') console.warn('log warning');
		else {
			console.error(err);
			return {Error: 'Wanrning in compress files'}
		};
	});

	archive.on('error', (err) => {
		console.error(err);
		if(err) return {Error: 'Error in compress files'};
	});

	archive.pipe(output);
	directory.forEach(element_directory => {
		const name = path.basename(element_directory);
		archive.append(fs.createReadStream(element_directory), { name: name });
	})

	output.on('close', () => {
		complete(fileName);
	})
	archive.finalize();

	return new Promise((resolve, reject) => {
		complete = resolve;
	})
}

const compress = async({directory, compress}) => {
	if(!compress.active) return directory;
	
	if(!Array.isArray(directory)) directory = [directory];
	let FileCompress;

	compress.type = compress.type.toLowerCase();

	if(compress.type === 'tar') {
		return await CompressFiles({directory: directory, compress: compress});
	}else if(compress.type === 'zip') {
		return await CompressFiles({directory: directory, compress: compress});
	}else {
		const message = 'Accepted compression format types are \"tar.gz\" and \"zip\"';
		console.error(message);
		return {Error: message}
	}
}

module.exports = compress;