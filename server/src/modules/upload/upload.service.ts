import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { extname } from 'path';
import { ulid } from 'ulid';
import s3Config from './config/s3.config';

@Injectable()
export class UploadService {
  constructor(
    @Inject(s3Config.KEY)
    private readonly s3Configuration: ConfigType<typeof s3Config>,
  ) {}

  s3 = new S3({
    credentials: {
      accessKeyId: this.s3Configuration.accessKey,
      secretAccessKey: this.s3Configuration.secretKey,
    },
    endpoint: this.s3Configuration.endpoint,
    region: 'default',
  });

  async uploadFile(file: Express.Multer.File, directory: string) {
    const extName = extname(file.originalname);

    return await this.s3
      .upload({
        Bucket: this.s3Configuration.bucketName,
        Key: `${directory}/${ulid()}${extName}`,
        Body: file.buffer,
      })
      .promise();
  }

  async deleteFile(key: string) {
    return await this.s3
      .deleteObject({
        Bucket: this.s3Configuration.bucketName,
        Key: decodeURI(key),
      })
      .promise();
  }
}
