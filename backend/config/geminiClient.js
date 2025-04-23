import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';
import { v4 as uuid } from 'uuid';

export const GeminiClient = {
  evaluateAnswer: async ({ fileUrl, totalMarks = 10 }) => {
    try {
      // Download file from the URL to a temp location
      const tempFilePath = path.join(tmpdir(), `${uuid()}.pdf`);
      const writer = fs.createWriteStream(tempFilePath);

      const response = await axios.get(fileUrl, { responseType: 'stream' });
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const form = new FormData();
      form.append('file', fs.createReadStream(tempFilePath));
      form.append('total_marks', totalMarks.toString());

      const aiResponse = await axios.post(
        'http://localhost:8000/upload',
        form,
        { headers: form.getHeaders() }
      );

      // Clean up temp file
      fs.unlinkSync(tempFilePath);

      return aiResponse.data;
    } catch (err) {
      console.error('GeminiClient error:', err.message);
      return {
        success: false,
        message: 'Failed to evaluate the answer file',
        error: err.message,
      };
    }
  }
};
