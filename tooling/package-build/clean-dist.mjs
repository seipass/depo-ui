import { access, rm } from 'node:fs/promises';
import path from 'node:path';

const outputDirectory = path.resolve(process.cwd(), 'dist');

try {
  await access(outputDirectory);
  await rm(outputDirectory, { recursive: true, force: true });
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
