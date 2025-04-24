import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CapitalizeNamePipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!value || !value.name || typeof value.name !== 'string') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    }

    // Capitalize each word in the name
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    value.name = value.name
      .toLowerCase()
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .split(' ')
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .join(' ');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}
