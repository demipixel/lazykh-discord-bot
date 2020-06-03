import Axios from 'axios';
import * as Fs from 'fs';

export async function downloadImage(url: string, fileName: string) {
  const path = './images/' + fileName;
  const writer = Fs.createWriteStream(path);

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
    maxContentLength: 1024 * 1024 * 50, // No more than 50 MB
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
