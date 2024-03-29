import { Image } from "image-js";
import axios from "axios";
import path, { dirname } from "path";
import { existsSync, mkdir } from "fs";

export async function tilePicture(imageURL: string, folder: string) {
  // Load the image from URL
  const response = await axios.get(imageURL,  { responseType: 'arraybuffer' })
  const buffer = Buffer.from(response.data, "utf-8")

  // Create the folder to receive the tiles
  const dir = `${__dirname}/../../uploads/${folder}`
  if (!existsSync(dir)) {
    mkdir(dir, (err) => {
      if (err) console.log(err)
    })
  }

  try {
    const image = await Image.load(buffer); 
    // We get the resolution of the original image
    let width = image.width;
    let height = image.height;
  
    // We calculate how many levels there will be for this image
    const levels = Math.floor(Math.log2(Math.max(width, height)));
  
    // For each level we will resize the image to the correct resolution
    // and cut each tile
    for (let i = levels; i >= 0; i--) {
      resizeImages(image, width, height, i, folder);
      width = Math.floor(width / 2);
      height = Math.floor(height / 2);
    }
  } catch (error) {
    console.log(error)
  }
}

async function resizeImages(image: Image, width: number, height: number, level: number, folder: string) {
  // We start by resizing the image to the correct resolution
  if (width === 0 || height === 0) return;

  try {
    const resizedImage = image.resize({
      width,
      height,
    });

    // We calculate the number of rows and colums of tiles that we will have
    const numberOfRows = width / 256;
    const numberOfColums = height / 256;

    // For each row and column we create a tile
    for (let i = 0; i < numberOfRows; i++) {
      for (let k = 0; k < numberOfColums; k++) {
        const x = i * 256;
        const y = k * 256;
        createATile(resizedImage, x, y, level, folder);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function createATile(image: Image, x: number, y: number, level: number, folder: string) {
  // Name the tile
  const tileName = `${level}_${x}_${y}.jpg`;

  let width = 0;
  let height = 0;

  // Calculate the width and height of the last tiles
  // so they don't overflow from the image
  if (image.width < 256) {
    width = image.width;
  } else if (image.width < x + 256) {
    width = image.width - x;
  } else {
    width = 256;
  }

  if (image.height < 256) {
    height = image.height;
  } else if (image.height < y + 256) {
    y;
    height = image.height - y;
  } else {
    height = 256;
  }

  // Create the tile
  const tile = image.crop({
    x: x,
    y: y,
    width,
    height,
  });
  // Save the image in the file system
  try {
    await tile.save(`${__dirname}/../../uploads/${folder}/${tileName}`);
  } catch (err) {
    console.log(err);
  }
}