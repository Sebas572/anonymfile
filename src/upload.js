"use strict;"

const https = require('node:https');
const FormData = require('form-data');
const fs = require('node:fs');
const path = require('path');

const url = {
	link: 'https://anonymfile.com/api/v1/upload',
	host: 'anonymfile.com',
	path: '/api/v1/upload',
	port: 443,
	method: 'POST',
};

const upload = async(directory, compress, progress) => {
	const remove_compress = () => {
  	//remove compression that was previously saved
		if(compress.active) {
			fs.rm(directory, (err) => {
				if(err) console.log('Error in remove file .tmp');
			});
		}
	}


	return new Promise(async(resolve, reject) => {
		const form = new FormData();
		
		if(!fs.existsSync(directory)) {
			reject({Error: `This file does not exist \"${directory}\"`});
		}else {
			let size = fs.lstatSync(directory).size;
			let bytes = 0;
			form.append('file', fs.createReadStream(directory).on('data', (chunk) => {
					if(progress !== undefined) {
						bytes += chunk.length;
						progress({progress: Math.trunc((bytes/size)*100), 'file': path.basename(directory)});
					}
			}));

			const config = {
				'method': 'POST',
				'host': url.host,
				'path': url.path,
				'headers': form.getHeaders(),
				'maxContentLength': Infinity,
				'maxBodyLength': Infinity,
			}

			const callback = (response) => {
				let get_data = '';
			  
			  response.on('data', (chunk) => {
			  	get_data += chunk;
			  });

			  response.on('end', () => {
			  	remove_compress();

					const Json = JSON.parse(get_data);
					Json['url'] = Json.data.file.url.full;
					
					resolve(Json);
			  });
			}

			const request = https.request(config, callback);
			form.pipe(request);

		  request.on('error', (err) => {
		  	remove_compress();
		  	reject({Error: `An error occurred while sending the file ${path.basename(directory)} \n${err}`});
		  })
		}
	});
}

module.exports = upload;