import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export const createTempDir = async (baseDir: string): Promise<string> => {
  const tmpDir = path.resolve(baseDir, "..", "tmp");
  try {
    await fs.mkdir(tmpDir, { recursive: true });
  } catch (err) {
    // Ignore if directory already exists
  }
  return tmpDir;
};

export const generateTempFilePaths = (tmpDir: string) => {
  const id = randomUUID();
  return {
    svgPath: path.join(tmpDir, `${id}.svg`),
    pngPath: path.join(tmpDir, `${id}.png`)
  };
};

export const cleanupTempFiles = async (svgPath: string, pngPath: string): Promise<void> => {
  await fs.unlink(svgPath).catch(() => {});
  await fs.unlink(pngPath).catch(() => {});
}; 