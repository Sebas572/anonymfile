"use strict";

const axios = require('axios');
const FormData = require('form-data');
const fs = require('node:fs');
const compressFiles = require('./CompressFiles.js');

const url = 'https://anonymfile.com/api/v1/upload';

const upload = async(directory, compress) => {
	const form = new FormData();

	
	if(!fs.existsSync(directory)) return {Error: 'This file does not exist'};
	form.append('file', fs.createReadStream(directory));

	const response = await axios.post(url, form, {
		'maxContentLength': Infinity,
		'maxBodyLength': Infinity
	}).catch(err => {
		const reason = 'An error occurred while trying to connect';

		throw (reason);
	}).finally(() => {
		//remove compression that was previously saved
		if(compress.active) {
			fs.rm(directory, (err) => {
				if(err) console.log('Error in remove file .tmp');
			});
		}
	});
	const Json = response.data;
	Json['url'] = Json.data.file.url.full;
	
	return Json;
}

const multiple_uploads = (directory, compress) => {
	const Json = [];

	return new Promise((resolve) => {
		directory.forEach(async(element, index) => {
			const get = await upload(element, compress);
			Json.push(get);
			
			if(Json.length === directory.length) resolve(Json);
		});

	});
}

//you must send the directory of the file to the "AnonymousFiles" function
const AnonymousFiles = async({directory, compress={active: false, name: 'Archive', type: 'tar'}}) => {
	if(compress.active === undefined) compress.active = false;
	if(compress.name === undefined) compress.name = 'Archive';
	if(compress.type === undefined) compress.type = 'tar';
	
	directory = await compressFiles({directory, compress});
	if(directory.Error !== undefined) return directory;

	if(!Array.isArray(directory)) return await upload(directory, compress);
	else return await multiple_uploads(directory, compress);

}

module.exports = AnonymousFiles;