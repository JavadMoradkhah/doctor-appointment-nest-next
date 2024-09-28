import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export interface Options {
  maxSize?: number;
  fileIsRequired?: boolean;
}

const defaultOptions: Options = {
  maxSize: 2 * 1024 * 1024,
  fileIsRequired: true,
};

export const ParseImageFilePipe = (options?: Options) => {
  return new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: options?.maxSize ?? defaultOptions.maxSize,
      }),
      new FileTypeValidator({ fileType: 'image/(png|jpg|jpeg)' }),
    ],
    fileIsRequired: options?.fileIsRequired ?? defaultOptions.fileIsRequired,
  });
};
