import axios from 'axios'
import FormData from 'form-data'
import fs from 'node:fs'

const url = 'https://anonymfile.com/api/v1/upload';

//you must send the directory of the file to the "AnonymousFiles" function
const AnonymousFiles = async({directory}) => {
	const form = new FormData();
	form.append('file', fs.createReadStream(directory));

	const response = await axios.post(url, form, {
		'maxContentLength': Infinity,
		'maxBodyLength': Infinity
	});
	const Json = response.data;
	Json['url'] = Json.data.file.url.full;

	return Json;
}

export default AnonymousFiles;
