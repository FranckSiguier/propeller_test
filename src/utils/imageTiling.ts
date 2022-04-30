import sharp from 'sharp'

export default async function tilePicture(image: File) {
  numberOfLevels(image);
}

async function numberOfLevels(image: any) {
  const metadata = await image.metadata();
  console.log(metadata.width, metadata.height);

  let width = metadata.width;
  let height = metadata.height;
  const levels = Math.log2(Math.max(width, height));
  for (let i = 0; i < levels + 1; i++) {
    const level = Math.floor(levels) - i;
    resizeImages(image, width, height, level);
    width = Math.floor(width / 2);
    height = Math.floor(height / 2);
  }
}

function resizeImages(image: any, width: number, height: number, level: number) {
  // Create the resized image
  // calculate the number of tiles for each row and column
  const numberOfRows = width / 256;
  const numberOfColums = height / 256;
  for (let i = 0; i < numberOfRows; i++) {
    for (let k = 0; k < numberOfColums; k++) {
      const x = i * 256;
      const y = k * 256;
      createATile(image, x, y, level);
      // Create the file in directory
    }
  }
}

function createATile(image: any, x: number, y: number, level: number) {}