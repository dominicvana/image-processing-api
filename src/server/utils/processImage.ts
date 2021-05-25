const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
import { PROCESSED_IMAGES_DIR } from './resizeAndWrite';

const parsePath = {
  name(filepath: string) {
    // const name = path.match(/\/(.+)\./);
    // if (name) return name[1];
    const segments = filepath.split('/');
    const pre = segments[segments.length - 1];
    return pre.split('.')[0];
  },
  extension(path: string) {
    const segments = path.split('.');
    return segments[segments.length - 1];
  },
};

const toPng = async function (filepath: string) {
  const image = parsePath.name(filepath);
  const output = path.join(PROCESSED_IMAGES_DIR, `${image}.png`);

  await sharp(filepath).png().toFile(output);

  return output;
};

const toJpeg = async function (filepath: string) {
  const image = parsePath.name(filepath);
  const output = path.join(PROCESSED_IMAGES_DIR, `${image}.jpeg`);

  await sharp(filepath).jpeg().toFile(output);

  return output;
};

const toWebP = async function (filepath: string) {
  const image = parsePath.name(filepath);
  const output = path.join(PROCESSED_IMAGES_DIR, `${image}.webp`);

  await sharp(filepath).webp().toFile(output);

  return output;
};

const toTiff = async function (filepath: string) {
  const image = parsePath.name(filepath);
  const output = path.join(PROCESSED_IMAGES_DIR, `${image}.tiff`);

  await sharp(filepath).tiff().toFile(output);

  return output;
};

const getMetaData = async function (path: string) {
  const metadata = await sharp(path).metadata();
  console.log('metadata', metadata);
};

const grayscale = async function (filepath: string) {
  const image = parsePath.name(filepath);
  const output = path.join(PROCESSED_IMAGES_DIR, `${image}-grayscale.png`);

  // Applies a grayscale effect to the image
  await sharp(filepath).grayscale().png().toFile(output);

  return output;
};

const resize = async function (
  filepath: string,
  width: number,
  height: number
) {
  const name = parsePath.name(filepath);
  const ext = parsePath.extension(filepath);
  const output = path.join(
    PROCESSED_IMAGES_DIR,
    `${name}-${width}x${height}.${ext}`
  );

  //  Resizes the image
  await sharp(filepath).resize(width, height).png().toFile(output);

  return output;
};

const blur = async function (filepath: string, blurFactor: number) {
  const name = parsePath.name(filepath);
  const output = path.join(
    PROCESSED_IMAGES_DIR,
    `${name}-blur-${blurFactor}.png`
  );

  // Blur the image. When used without parameters, performs a fast, mild blur of the output image. When a sigma is provided, performs a slower, more accurate Gaussian blur.
  // Value between 0.3 and 1000
  await sharp(filepath).blur(blurFactor).png().toFile(output);

  return output;
};

const reformat = async function (
  filepath: string,
  format: string
): Promise<string | undefined> {
  switch (format) {
    case 'png':
      return toPng(filepath);
    case 'jpeg':
      return toJpeg(filepath);
    case 'webp':
      return toWebP(filepath);
    case 'tiff':
      return toTiff(filepath);
  }
};

const applyEffect = async function (filepath: string, effect: string) {
  switch (effect) {
    case 'blur':
      return blur(filepath);
    case 'grayscale':
      return grayscale(filepath);
  }
};

export default {
  reformat,
  applyEffect,
  getMetaData,
  grayscale,
  resize,
  blur,
};
