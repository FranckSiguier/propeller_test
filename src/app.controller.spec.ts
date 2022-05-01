import { Test, TestingModule } from '@nestjs/testing';
import { existsSync, rmdirSync } from 'fs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
const path = require('path')

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  afterAll(async () => {
    const dir = path.join(__dirname, '../uploads/test')
    if (existsSync(dir)) {
      rmdirSync(dir, { recursive: true })
    }
  })

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('[POST] /upload', () => {
    it('should tile the picture you gave the URL to', () => {
      expect(appController.tileImage({
        'imageAddress': 'https://images.pexels.com/photos/9821104/pexels-photo-9821104.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500', 
        "folder": "test"}))
        .toBe('It worked')
    })

    it('should not tile the picture if it is not an image', () => {
      expect(appController.tileImage({'imageAddress': 'shdsqj', "folder": "test"})).toBe('The file is not an image')
    })
  })
});
