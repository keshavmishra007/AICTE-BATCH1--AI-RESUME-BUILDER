import axios from 'axios';
import FormData from 'form-data';
import { env } from '../config/env.js';

const client = axios.create({
  baseURL: env.aiServiceUrl,
  timeout: 60000
});

export async function generateResume(profile, targetRole) {
  const { data } = await client.post('/generate-resume', { profile, target_role: targetRole });
  return data;
}

export async function generateCoverLetter(payload) {
  const { data } = await client.post('/generate-cover-letter', payload);
  return data;
}

export async function analyzeResume(file) {
  const form = new FormData();
  form.append('file', file.buffer, { filename: file.originalname, contentType: file.mimetype });
  const { data } = await client.post('/analyze-resume', form, { headers: form.getHeaders() });
  return data;
}
