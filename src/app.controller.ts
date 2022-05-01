import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { tilePicture } from './utils/imageTiling';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  tileImage(@Body() imageURL: {imageAddress: string, folder: string}): string {
    const regex = new RegExp('.*(.jpg|.png|.jpeg).*')
    if (!imageURL.imageAddress.match(regex)) return('The file is not an image')
    tilePicture(imageURL.imageAddress, imageURL.folder)
    return('It worked')

  }
}
