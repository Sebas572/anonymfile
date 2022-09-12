"use strict";

const fs = require('node:fs');
const archiver = require('archiver');
const path = require('path');

const formats = {
	zip: 'zip',
	tar: 'tar.gz'
}

const start_compression = ({directory, compress}) => {
	return new Promise((resolve, reject) => {
		directory.forEach((dir) => {
			if(!fs.existsSync(dir)) {
				const err = `This file does not exist \"${dir}\"`;
				
				reject({Error: err});
				throw(err);
			}
		})

		const type = formats[compress.type];
		const fileName = path.join(__dirname, '..', '.tmp', `${compress.name}.${type}`);
		const output = fs.createWriteStream(fileName);
		const archive = archiver(compress.type, {zlib: { level: 9 }});

		output.on('end', () => {
			const message = 'Data has been drained';
			console.error(message);
			reject({Error: message});
		});

		archive.on('warning', (err) => {
			if (err.code === 'ENOENT') console.warn('log warning');
			else {
				console.error(err);
				reject({Error: 'Wanrning in compress files'});
			};
		});

		archive.on('error', (err) => {
			if(err) {
				console.error(err);
				reject({Error: 'Error in compress files'})
			};
		});

		archive.pipe(output);
		directory.forEach(element_directory => {
			const name = path.basename(element_directory);
			archive.append(fs.createReadStream(element_directory), { name: name });
		})

		output.on('close', () => {
			resolve(fileName);
		})
		archive.finalize();
	})
}

const manage_compression = async({directory, compress}) => {
	try {
		const data = await start_compression({directory: directory, compress: compress});
		return data;
	}catch (err) {
		return err;
	};	
}

const compress = async({directory, compress}) => {
	if(compress.active === undefined) return directory;
	if(typeof compress.active !== 'boolean') return {Error: 'The variable \"compress.active\" must be of type \"Boolean\"'};
	if(typeof compress.name !== 'string') return {Error: 'The variable \"compress.name\" must be of type \"String\"'};
	if(typeof compress.type !== 'string') return {Error: 'The variable \"compress.type\" must be of type \"String\" and the available options are \"tar\" or \"zip\"'};
	if(!compress.active === true) return directory;
	
	if(!Array.isArray(directory)) directory = [directory];
	let FileCompress;

	compress.type = compress.type.toLowerCase();

	if(compress.type === 'tar') {
		return await manage_compression({directory: directory, compress: compress});
	}else if(compress.type === 'zip') {
		return  await manage_compression({directory: directory, compress: compress});
	}else {
		const message = 'Accepted compression format types are \"tar.gz\" and \"zip\"';
		console.error(message);
		return {Error: message}
	}
}

module.exports = compress;